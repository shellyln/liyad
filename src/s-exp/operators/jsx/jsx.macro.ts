// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxParserState } from '../../types';
import { quote }         from '../../ast';



export const macros: SxMacroInfo[] = [{
    name: '@',
    fn: (state: SxParserState, name: string) => (list) => {
        return quote(state, list);
    },
}, {
    name: '$=if',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($=if cond expr)
        //  -> S expr  : ($=__if cond 'expr)
        return [
            {symbol: '$=__if'},
            list[1],
            ...(list.slice(2).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$=for',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($=for list expr)
        //  -> S expr  : ($=__for list 'expr)
        return [
            {symbol: '$=__for'},
            list[1],
            ...(list.slice(2).map(x => quote(state, x))),
        ];
    },
}];


export default macros;
