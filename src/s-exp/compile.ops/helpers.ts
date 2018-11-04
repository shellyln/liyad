// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxToken,
         isSymbol }           from '../types';
import { resolveMacro,
         resolveValueSymbol,
         getScope }           from '../evaluate';
import { setEvaluationCount } from '../errors';



export function applyMacros(state: SxParserState, tok: SxToken) {
    let r: SxToken = tok;
    for (;;) {
        if (Array.isArray(r)) {
            if (r.length === 0) {
                break;
            }
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


export function resolveValueSymbol_dynamic(state: SxParserState, name: string) {
    return (function(){ return resolveValueSymbol(state, {symbol: name}); });
}
