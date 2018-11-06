// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxSymbol,
         SxToken,
         SxFuncInfo,
         CompilerOperator,
         CompilerContext,
         isSymbol }                   from './types';
import { getCapturedScopes,
         optimizeTailCall }           from './evaluate';
import { applyMacros,
         stripQuoteOrPass,
         resolveValueSymbol_dynamic } from './compile.ops/helpers';
import { registerOperators }          from './compile.ops';



// tslint:disable-next-line:variable-name
function compileCore(state: SxParserState, formalArgs: SxSymbol[], lastIsSpread: boolean, fnBody: any[], _$_vars: any[]) {

    function makeScope(scoped: () => void) {
        const varNamesCopy = new Map<string, string>();
        for (const x of ctx.varNames.entries()) {
            varNamesCopy.set(x[0], x[1]);
        }
        scoped();
        ctx.varNames = varNamesCopy;
    }


    function compileValue(b: any) {
        let compFnBody = '';
        if (b === null) {
            compFnBody += '(null)';
        } else if (b === void 0) {
            compFnBody += '(void 0)';
        } else switch (typeof b) {
        case 'boolean': case 'number':
            compFnBody += `(${String(b)})`;
            break;
        case 'object':
            if (isSymbol(b)) {
                const sym = b as SxSymbol;
                if (ctx.varNames.has(sym.symbol)) {
                    compFnBody += `(${ctx.varNames.get(sym.symbol)})`;
                } else {
                    _$_vars[ctx.varsCount] = sym.symbol;
                    compFnBody += `(_$_vars[${String(ctx.varsCount++)}])`;
                }
                break;
            } else {}
            // FALL_THRU
        default:
            _$_vars[ctx.varsCount] = b;
            compFnBody += `(_$_vars[${String(ctx.varsCount++)}])`;
            break;
        }
        return compFnBody;
    }


    function compileToken(body: any[], i: number) {
        let compFnBody = '';
        const b = body[i];
        if (Array.isArray(b)) {
            if (0 < b.length) {
                const r: SxToken = applyMacros(state, b);
                if (Array.isArray(r)) {
                    if (0 < r.length) {
                        if (isSymbol(r[0])) {
                            const sym = r[0] as SxSymbol;
                            const args = r.slice(1);
                            if (ops.has(sym.symbol)) {
                                compFnBody += (ops.get(sym.symbol) as CompilerOperator)(r, args);
                            } else {
                                if (sym.symbol === '$spread') {
                                    compFnBody += `...(${
                                        args.map((x) => compileToken([stripQuoteOrPass(state, x)], 0)).join(',')})`;
                                } else if (state.funcMap.has(sym.symbol)) {
                                    _$_vars[ctx.varsCount] = (state.funcMap.get(sym.symbol) as SxFuncInfo).fn(state, '');
                                    compFnBody += `((_$_vars[${String(ctx.varsCount++)}])(${
                                        args.map((x) => compileToken([stripQuoteOrPass(state, x)], 0)).join(',')}))`;
                                } else if (ctx.varNames.has(sym.symbol)) {
                                    compFnBody += `(${String(ctx.varNames.get(sym.symbol))})(${
                                        args.map((x) => compileToken([stripQuoteOrPass(state, x)], 0)).join(',')})`;
                                } else {
                                    _$_vars[ctx.varsCount] = resolveValueSymbol_dynamic(state, sym.symbol);
                                    compFnBody += `((_$_vars[${String(ctx.varsCount++)}])()(${
                                        args.map((x) => compileToken([stripQuoteOrPass(state, x)], 0)).join(',')}))`;
                                }
                            }
                        } else {
                            switch (typeof r[0]) {
                            case 'function':
                                _$_vars[ctx.varsCount] = r[0];
                                compFnBody += `((_$_vars[${String(ctx.varsCount++)}])(${
                                    r.slice(1).map((x, idx, arr) => compileToken([stripQuoteOrPass(state, x)], 0)).join(',')}))`;
                                break;
                            default:
                                throw new Error(`[SX] compileToken: First item of list is not a function: ${JSON.stringify(r[0])}.`);
                            }
                        }
                    } else {
                        compFnBody += '([])';
                    }
                } else {
                    compFnBody += compileValue(b);
                }
            } else {
                compFnBody += '([])';
            }
        } else {
            compFnBody += compileValue(b);
        }
        return compFnBody;
    }


    const ctx: CompilerContext = {
        _$_vars,
        varsCount: 1,
        varNames: new Map<string, string>(),
        varNamesCount: 0,
        varDefs: 'var x0;',
        ops: new Map<string, CompilerOperator>(),
        makeScope,
        compileToken,
    };

    registerOperators(state, ctx);
    const ops = ctx.ops;

    if (state.config.enableTailCallOptimization) {
        fnBody = optimizeTailCall(state, formalArgs, fnBody);
    }

    const capturedScopes = getCapturedScopes(state);
    if (capturedScopes) {
        for (const x in capturedScopes) {
            if (Object.hasOwnProperty.call(capturedScopes, x)) {
                _$_vars[ctx.varsCount++] = x;
                _$_vars[ctx.varsCount] = capturedScopes[x];
                ctx.varNames.set(x, `(_$_vars[${String(ctx.varsCount)}][_$_vars[${String(ctx.varsCount - 1)}]])`);
                ctx.varsCount++;
            }
        }
    }

    const compFormalArgs = `${formalArgs.map((x, i) => {
        ctx.varNames.set(formalArgs[i].symbol, 'a' + i);
        return `${(lastIsSpread && i === formalArgs.length - 1) ? '...' : ''}a${i}`;
    }).join(',')}`;

    const compFnBodyRoot = `return(${fnBody.map((x, i) => compileToken(fnBody, i)).join(',')})`;
    return `(function(${compFormalArgs}){"strict";${ctx.varDefs}${compFnBodyRoot}})`;
}


// tslint:disable-next-line:variable-name
function evalCompiledLambda(_$_state: SxParserState, _$_vars: any[], code: string) {
    // tslint:disable-next-line:no-eval
    _$_vars[0] = eval(code);
    return _$_vars[0];
}


export function compileLambda(state: SxParserState, formalArgs: SxSymbol[], lastIsSpread: boolean, fnBody: any[]) {
    // tslint:disable-next-line:variable-name
    const _$_vars: any[] = [];
    return evalCompiledLambda(state, _$_vars, compileCore(state, formalArgs, lastIsSpread, fnBody, _$_vars));
}
