// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxExternalValue,
         SxSymbol,
         SxDottedPair,
         SxDottedFragment,
         SxToken          } from './types';



export function resolveMacro(state: SxParserState, x: SxSymbol): ((list: SxToken[]) => SxToken) | false {
    const macroInfo = state.macroMap.get(x.symbol);
    if (macroInfo) {
        return macroInfo.fn(state, x.symbol);
    } else {
        return false;
    }
}


export function resolveFunctionSymbol(state: SxParserState, x: SxSymbol) {
    const funcInfo = state.funcMap.get(x.symbol);
    if (funcInfo) {
        return funcInfo.fn(state, x.symbol);
    } else {
        if (state.config.funcSymbolResolverFallback) {
            return state.config.funcSymbolResolverFallback(state, x.symbol);
        }
        if (state.config.raiseOnUnresolvedSymbol) {
            throw new Error(`[SX] resolveFunctionSymbol: Unresolved symbol: ${x.symbol}.`);
        }
        return x.symbol;
    }
}


export function resolveValueSymbol(state: SxParserState, x: SxSymbol) {
    const scope = getScope(state);
    if (scope && Object.prototype.hasOwnProperty.call(scope, x.symbol)) {
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


export function installScope(state: SxParserState, scope: any): any {
    state.scopes.push(scope);
}

export function uninstallScope(state: SxParserState): any {
    return state.scopes.pop();
}

export function getScope(state: SxParserState): any {
    return state.scopes[state.scopes.length - 1];
}


export function evalute(state: SxParserState, x: SxToken): SxToken {
    if (x === null || x === void 0) {
        return x;
    }
    let r: SxToken = x;

    for (;;) {
        if (Array.isArray(r)) {
            if (r.length === 0) {
                return r;
            }
            if (Object.prototype.hasOwnProperty.call(r[0], 'symbol')) {
                const m = resolveMacro(state, r[0] as SxSymbol);

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
    }

    if (Array.isArray(r)) {
        r = r.slice(0);
        if (0 < r.length) {
            const sym = r[0] as SxSymbol;
            if (Object.prototype.hasOwnProperty.call(sym, 'symbol')) {
                if (sym.symbol === state.config.reservedNames.quote) {
                    return r.slice(1, 2)[0];
                }
                if (sym.symbol === state.config.reservedNames.eval) {
                    return evalute(state, r[1]);
                }
            }

            for (let i = r.length - 1; i > 0; i--) {
                r[i] = evalute(state, r[i]);
            }

            const fn = resolveFunctionSymbol(state, sym) as any;
            if (typeof fn === 'function') {
                r = (fn as any)(...(r.slice(1)));
            } else {
                throw new Error(`[SX] evalute: First item of list is not a function: ${JSON.stringify(r)}.`);
            }
        }
    } else if (state.config.wrapExternalValue && Object.prototype.hasOwnProperty.call(r, 'value')) {
        r = (r as SxExternalValue).value;
    } else if (Object.prototype.hasOwnProperty.call(r, 'symbol')) {
        r = resolveValueSymbol(state, r as SxSymbol);
    } else if (Object.prototype.hasOwnProperty.call(r, 'car')) {
        r = [
            evalute(state, (r as SxDottedPair).car),
            evalute(state, (r as SxDottedPair).cdr),
        ];
    } else if (Object.prototype.hasOwnProperty.call(r, 'dotted')) {
        r = [
            evalute(state, (r as SxDottedFragment).dotted),
        ];
    } else if (Object.prototype.hasOwnProperty.call(r, 'comment')) {
        r = state.config.strippedCommentValue;
    }

    return r;
}
