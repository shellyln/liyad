// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxSymbolInfo  } from './types';



export const symbols: SxSymbolInfo[] = [
    {name: 'nil', fn: (state: SxParserState, name: string) => []},
    {name: 'null', fn: (state: SxParserState, name: string) => null},
    {name: 'undefined', fn: (state: SxParserState, name: string) => void 0},
    {name: 'true', fn: (state: SxParserState, name: string) => true},
    {name: 'false', fn: (state: SxParserState, name: string) => false},
    {name: '+Infinity', fn: (state: SxParserState, name: string) => +Infinity},
    {name: '-Infinity', fn: (state: SxParserState, name: string) => -Infinity},
    {name: 'NaN', fn: (state: SxParserState, name: string) => NaN},
];
