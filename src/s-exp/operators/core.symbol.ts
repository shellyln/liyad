// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxSymbolInfo } from '../types';



export const symbols: SxSymbolInfo[] = [
    {name: 'nil', fn: (state: SxParserState, name: string) => []},
    {name: 'null', fn: (state: SxParserState, name: string) => null},

    {name: 'undefined', fn: (state: SxParserState, name: string) => void 0},

    {name: 'true', fn: (state: SxParserState, name: string) => true},
    {name: '#true', fn: (state: SxParserState, name: string) => true},
    {name: '#t', fn: (state: SxParserState, name: string) => true},

    {name: 'false', fn: (state: SxParserState, name: string) => false},
    {name: '#false', fn: (state: SxParserState, name: string) => false},
    {name: '#f', fn: (state: SxParserState, name: string) => false},

    {name: '#Number:Infinity', fn: (state: SxParserState, name: string) => Number.POSITIVE_INFINITY},
    {name: '+Infinity', fn: (state: SxParserState, name: string) => Number.POSITIVE_INFINITY},
    {name: '-Infinity', fn: (state: SxParserState, name: string) => Number.NEGATIVE_INFINITY},

    {name: '#Number:Epsilon', fn: (state: SxParserState, name: string) => Number.EPSILON},
    {name: '#Number:MaxValue', fn: (state: SxParserState, name: string) => Number.MAX_VALUE},
    {name: '#Number:MinValue', fn: (state: SxParserState, name: string) => Number.MIN_VALUE},
    {name: '#Number:MinSafeInteger', fn: (state: SxParserState, name: string) => Number.MAX_SAFE_INTEGER},
    {name: '#Number:MinSafeInteger', fn: (state: SxParserState, name: string) => Number.MIN_SAFE_INTEGER},

    {name: 'NaN', fn: (state: SxParserState, name: string) => Number.NaN},
];


export default symbols;
