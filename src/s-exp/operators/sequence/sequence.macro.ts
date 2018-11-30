// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxParserState } from '../../types';
import { isSymbol }      from '../../ast';



export const macros: SxMacroInfo[] = [{
    name: '$[',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($[ index ] listOrObject)
        //  -> S expr  : ($__at listOrObject)
        const symOf = isSymbol(list[2], ']');
        if (! symOf) {
            throw new Error(`[SX] $repeat: Invalid syntax: missing ']' keyword.`);
        }
        return [{symbol: '$__at'},
            list[1],
            list[3],
        ];
    },
}];


export default macros;
