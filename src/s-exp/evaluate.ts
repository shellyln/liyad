// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxExternalValue,
         SxSymbol,
         SxDottedPair,
         SxDottedFragment,
         SxToken,
         SxScope,
         CapturedScopes }     from './types';
import { isSymbol }           from './ast';
import { setEvaluationCount } from './errors';



export function toNumber(x: any) {
    switch (typeof x) {
    case 'object': case 'symbol': case 'function':
        return NaN;
    default:
        return Number(x);
    }
}


export function resolveUnquote(state: SxParserState, r: SxToken[]) {
    for (let i = 0; i < r.length; i++) {
        const symUnquote = Array.isArray(r[i]) && isSymbol((r[i] as SxToken[])[0], state.config.reservedNames.unquote);
        if (symUnquote) {
            r = r.slice(0, i).concat([evaluate(state, (r[i] as SxToken[])[1])], r.slice(i + 1));
        }
        if (Array.isArray(r[i])) {
            r = r.slice(0);
            r[i] = resolveUnquote(state, r[i] as SxToken[]);
        }
    }
    return resolveSplice(state, r);
}


export function resolveSplice(state: SxParserState, r: SxToken[]) {
    if (state.config.enableSplice) {
        for (let i = r.length - 1; i >= 0; i--) {
            const symSplice = Array.isArray(r[i]) && isSymbol((r[i] as SxToken[])[0], state.config.reservedNames.splice);
            if (symSplice) {
                r = r.slice(0, i).concat((r[i] as SxToken[])[1], r.slice(i + 1));
            }
        }
    }
    return r;
}


export function resolveMacro(state: SxParserState, x: SxSymbol): ((list: SxToken[]) => SxToken) | false {
    const macroInfo = state.macroMap.get(x.symbol);
    if (macroInfo) {
        return macroInfo.fn(state, x.symbol);
    } else {
        return false;
    }
}


export function resolveFunctionSymbol(state: SxParserState, x: SxSymbol) {
    if (typeof x === 'function') {
        return x;
    }
    const funcInfo = state.funcMap.get(x.symbol);
    if (funcInfo) {
        return funcInfo.fn(state, x.symbol);
    } else {
        const v = resolveValueSymbol(state, x);
        if (typeof v === 'function') {
            return v;
        }
        if (state.config.funcSymbolResolverFallback) {
            return state.config.funcSymbolResolverFallback(state, x.symbol);
        }
        if (state.config.raiseOnUnresolvedSymbol) {
            throw new Error(`[SX] resolveFunctionSymbol: Unresolved symbol: ${x.symbol}.`);
        }
        return x.symbol;
    }
}


export function resolveValueSymbolScope(state: SxParserState, x: SxSymbol, nullIfNotDefined: boolean) {
    for (let i = state.scopes.length - 1; i > 0; i--) {
        const localScope: SxScope = state.scopes[i];
        if (localScope && Object.prototype.hasOwnProperty.call(localScope.scope, x.symbol)) {
            return localScope.scope;
        }
        if (localScope.capturedScopes &&
            Object.prototype.hasOwnProperty.call(localScope.capturedScopes, x.symbol)) {
            return localScope.capturedScopes[x.symbol];
        }
        if (! localScope.isBlockLocal) {
            break;
        }
    }
    const globalScope = getGlobalScope(state);
    if (Object.prototype.hasOwnProperty.call(globalScope.scope, x.symbol)) {
        return globalScope.scope;
    }
    return nullIfNotDefined ? null : getScope(state).scope;
}


export function resolveValueSymbol(state: SxParserState, x: SxSymbol) {
    const scope = resolveValueSymbolScope(state, x, true);
    if (scope) {
        return scope[x.symbol];
    }
    const symInfo = state.symbolMap.get(x.symbol);
    if (symInfo) {
        return symInfo.fn(state, x.symbol);
    } else {
        if (state.config.valueSymbolResolverFallback) {
            return state.config.valueSymbolResolverFallback(state, x.symbol);
        }
        if (state.config.raiseOnUnresolvedSymbol) {
            throw new Error(`[SX] resolveValueSymbol: Unresolved symbol: ${x.symbol}.`);
        }
        return x.symbol;
    }
}


export function collectCapturedVariables(state: SxParserState, names: SxSymbol[]): CapturedScopes {
    const capturedScopes: CapturedScopes = {};
    for (const n of names) {
        const scope = resolveValueSymbolScope(state, n, true);
        if (scope === null) {
            throw new Error(`[SX] collectCapturedVariables: Unresolved symbols ${n}`);
        }
        capturedScopes[n.symbol] = scope;
    }
    return capturedScopes;
}


export function getCapturedScopes(state: SxParserState): CapturedScopes | undefined {
    const a: CapturedScopes[] = [];
    for (let i = state.scopes.length - 1; i > 0; i--) {
        const localScope: SxScope = state.scopes[i];
        if (localScope.capturedScopes) {
            a.unshift(localScope.capturedScopes);
        }
        if (! localScope.isBlockLocal) {
            break;
        }
    }
    return a.length > 0 ? Object.assign({}, ...a) : void 0;
}


export function installScope(state: SxParserState, scope: any, isBlockLocal: boolean, capturedScopes?: CapturedScopes): any {
    state.scopes.push({isBlockLocal, scope, capturedScopes});
}


export function uninstallScope(state: SxParserState): any {
    if (state.scopes.length < 2) {
        throw new Error(`[SX] uninstallScope: Unable to pop stack.`);
    }
    return state.scopes.pop();
}


export function getScope(state: SxParserState) {
    return state.scopes[state.scopes.length - 1];
}


export function getGlobalScope(state: SxParserState) {
    return state.scopes[0];
}


export function optimizeTailCall(state: SxParserState, formalArgs: SxSymbol[], fnBody: SxToken[]) {
    // S expression: ($__lambda '(sym1 ... symN) 'expr1 ... 'exprN)
    //    formalArgs: 'sym1 ... 'symN
    //        fnBody: 'expr1 ... 'exprN
    if (Array.isArray(fnBody[fnBody.length - 1])) {
        const front = fnBody.slice(0, fnBody.length - 1);
        const tail = fnBody[fnBody.length - 1];
        if (tail && (typeof tail[0] === 'object') && tail[0].symbol === state.config.reservedNames.if) {
            // S expression: ($if cond t-expr f-expr)
            if (Array.isArray(tail[3]) && (typeof tail[3][0] === 'object') && tail[3][0].symbol === state.config.reservedNames.self) {
                // S expression (recursive):
                //     (                                 ;; fnBody
                //         expr1 ... exprN-1             ;; front
                //         ($if cond                     ;; tail[0] [1]
                //             t-expr                    ;;     [2]
                //             ($self                    ;;     [3]
                //                 rArgs1 ... rArgsN) )  ;; tail[4] ... [N+4]
                //     )
                //
                //  -> S exp (tail call optimization):
                //     (                                                                  ;; fnBody
                //         ($until cond                                                   ;; tail[1]
                //             ($clisp-let (tempsym1 ... tempsymN)                        ;;
                //                 expr1 ... exprN-1                                      ;; front
                //                 ($set tempsym1   rArgs1) ... ($set tempsymN   rArgsN)  ;; tail[4] ... [N+4]
                //                 ($set     sym1 tempsym1) ... ($set     symN tempsymN)  ;;
                //             )                                                          ;;
                //         )                                                              ;;
                //         expr1 ... exprN-1                                              ;; front
                //         t-expr                                                         ;; tail[2]
                //     )

                const varBaseName = `$__tempvar__$$ec${state.evalCount++}$$_`;
                const tempVarsSyms = formalArgs.map((a, idx) => ({symbol: `${varBaseName}_$i${idx}_${a.symbol}`}));

                return [
                    [{symbol: state.config.reservedNames.until}, tail[1],
                        [{symbol: state.config.reservedNames.let}, [...tempVarsSyms],
                            ...front,
                            ...((tail[3].slice(1) as any[]).map((x: any, idx) =>
                                [{symbol: state.config.reservedNames.set}, tempVarsSyms[idx], x])),
                            ...(tempVarsSyms.map((x, idx) =>
                                [{symbol: state.config.reservedNames.set}, formalArgs[idx], x])),
                        ],
                    ],
                    ...front,
                    tail[2],
                ];
            }
        }
    }
    return fnBody;
}


export function evaluate(state: SxParserState, x: SxToken): SxToken {
    setEvaluationCount(state);

    if (x === null || x === void 0) {
        return x;
    }
    let r: SxToken = x;

    for (;;) {
        if (Array.isArray(r)) {
            if (r.length === 0) {
                return r;
            }

            r = resolveSplice(state, r);

            const sym = isSymbol(r[0]);
            if (sym) {
                const m = resolveMacro(state, sym);

                if (m) {
                    r = m(r);
                } else {
                    break;
                }
            } else {
                break;
            }
        } else {
            break;
        }

        setEvaluationCount(state);
    }

    if (Array.isArray(r)) {
        r = r.slice(0);
        if (0 < r.length) {
            const sym = isSymbol(r[0]);
            if (sym) {
                if (sym.symbol === state.config.reservedNames.quote) {
                    return r.slice(1, 2)[0];
                }
                if (sym.symbol === state.config.reservedNames.backquote) {
                    r = r.slice(1, 2)[0];
                    if (Array.isArray(r)) {
                        r = resolveUnquote(state, r);
                    }
                    return r;
                }
                if (sym.symbol === state.config.reservedNames.eval) {
                    return evaluate(state, evaluate(state, r.slice(1, 2)[0]));
                }
            }

            const sprs = [];
            for (let i = 1; i < r.length; i++) {
                const symSpr = Array.isArray(r[i]) && isSymbol((r[i] as SxToken[])[0], state.config.reservedNames.spread);
                if (symSpr) {
                    sprs.push(i);
                    const a = evaluate(state, (r[i] as SxToken[])[1]);
                    r[i] = Array.isArray(a) ? a : [a];
                } else {
                    r[i] = evaluate(state, r[i]);
                }
            }
            for (const i of sprs.reverse()) {
                r = (r as SxToken[]).slice(0, i).concat(r[i], r.slice(i + 1));
            }

            let fn: any;
            if (typeof r[0] === 'function') {
                fn = r[0];
            } else if (sym) {
                fn = resolveFunctionSymbol(state, sym);
            } else {
                fn = evaluate(state, r[0]);
            }

            if (typeof fn === 'function') {
                r = (fn as any)(...(r.slice(1)));
            } else {
                throw new Error(`[SX] evaluate: First item of list is not a function: ${JSON.stringify(r)}.`);
            }
        }
    } else if (state.config.wrapExternalValue && Object.prototype.hasOwnProperty.call(r, 'value')) {
        r = (r as SxExternalValue).value;
    } else if (Object.prototype.hasOwnProperty.call(r, 'symbol')) {
        r = resolveValueSymbol(state, r as SxSymbol);
    } else if (Object.prototype.hasOwnProperty.call(r, 'car')) {
        const car = evaluate(state, (r as SxDottedPair).car);
        const cdr = evaluate(state, (r as SxDottedPair).cdr);
        if (Array.isArray(cdr)) {
            const a = (cdr as any[]).slice(0);
            a.unshift(car);
            r = a;
        } else {
            r = { car, cdr };
        }
    } else if (Object.prototype.hasOwnProperty.call(r, 'dotted')) {
        r = [
            evaluate(state, (r as SxDottedFragment).dotted),
        ];
    } else if (Object.prototype.hasOwnProperty.call(r, 'comment')) {
        r = [];
    }

    return r;
}
