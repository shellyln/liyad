// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxSymbol }     from './types';



export function quote(state: SxParserState, x: any) {
    return [{symbol: state.config.reservedNames.quote}, x];
}


export function isQuoted(state: SxParserState, x: any) {
    if (Array.isArray(x) && 0 < x.length) {
        const q = isSymbol(x);
        if (q && q.symbol === state.config.reservedNames.quote) {
            return true;
        }
    }
    return false;
}


export function backquote(state: SxParserState, x: any) {
    return [{symbol: state.config.reservedNames.backquote}, x];
}


export function isBackquoted(state: SxParserState, x: any) {
    if (Array.isArray(x) && 0 < x.length) {
        const q = isSymbol(x);
        if (q && q.symbol === state.config.reservedNames.backquote) {
            return true;
        }
    }
    return false;
}


export function wrapByUnquote(state: SxParserState, x: any) {
    return [{symbol: state.config.reservedNames.unquote}, x];
}


export function isUnquoted(state: SxParserState, x: any) {
    if (Array.isArray(x) && 0 < x.length) {
        const q = isSymbol(x);
        if (q && q.symbol === state.config.reservedNames.unquote) {
            return true;
        }
    }
    return false;
}


export function spread(state: SxParserState, x: any) {
    return [{symbol: state.config.reservedNames.spread}, x];
}


export function splice(state: SxParserState, x: any) {
    return [{symbol: state.config.reservedNames.splice}, x];
}


export function isSymbol(x: any, name?: string): SxSymbol | null {
    if (x && typeof x === 'object' && Object.prototype.hasOwnProperty.call(x, 'symbol')) {
        if (name !== void 0) {
            return x.symbol === name ? x : null;
        } else {
            return x;
        }
    }
    return null;
}
