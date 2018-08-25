// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxParserState,
         quote }             from '../../types';
import { checkParamsLength } from '../../errors';



export const macros: SxMacroInfo[] = [{
    name: '$let-async',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($let-async nameStrOrSymbol promise)
        //  -> S expr  : ($__let-async 'nameStrOrSymbol promise)
        checkParamsLength('$let-async', list, 3, 3);

        return [{symbol: '$__let-async'},
            quote(state, list[1]),
            list[2],
        ];
    },
}, {
    name: '$set-async',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($set-async nameOrListOfNameOrIndex promise)
        //  -> S expr  : ($__set-async 'nameOrListOfNameOrIndex promise)
        checkParamsLength('$set-async', list, 3, 3);

        return [{symbol: '$__set-async'},
            quote(state, list[1]),
            list[2],
        ];
    },
}];


export default macros;
