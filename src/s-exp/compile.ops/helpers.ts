// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxToken }             from '../types';
import { isSymbol }            from '../ast';
import { resolveSplice,
         resolveMacro,
         resolveValueSymbol,
         getScope }            from '../evaluate';
import { setEvaluationCount,
         checkUnsafeVarNamesEx,
         checkUnsafeVarNames } from '../errors';



export function applyMacros(state: SxParserState, tok: SxToken) {
    let r: SxToken = tok;
    for (;;) {
        if (Array.isArray(r)) {
            if (r.length === 0) {
                break;
            }
            r = resolveSplice(state, r);
            const sym = isSymbol(r[0]);
            if (sym) {
                const m = resolveMacro(state, sym, r);
                if (m) {
                    r = m.fn(m.actualArgs as SxToken[]);
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
    return r;
}


export function stripQuote(state: SxParserState, tok: SxToken) {
    if (! (Array.isArray(tok) && isSymbol((tok as any)[0], state.config.reservedNames.quote))) {
        throw new Error(`[SX] stripQuote: token is not quoted.`);
    }
    return (tok as any)[1];
}


export function stripQuoteOrPass(state: SxParserState, tok: SxToken) {
    if (Array.isArray(tok) && isSymbol((tok as any)[0], state.config.reservedNames.quote)) {
        return (tok as any)[1];
    } else {
        return tok;
    }
}


export function getScope_stateApplied(state: SxParserState) {
    return (function() { return getScope(state); });
}


export function resolveValueSymbol_dynamic(state: SxParserState, varName: string) {
    checkUnsafeVarNames('(compiler)resolveValueSymbol_dynamic', varName);
    return (function(){ return resolveValueSymbol(state, {symbol: varName}); });
}

export function checkUnsafeVarNames_dynamic(name: string) {
    return (function(varName: string){ return checkUnsafeVarNames(name, varName); });
}
