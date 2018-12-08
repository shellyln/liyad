// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxParserState }     from '../../types';
import { isSymbol,
         quote }             from '../../ast';
import { checkParamsLength } from '../../errors';



export const macros: SxMacroInfo[] = [{
    name: '$incl',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($incl name)
        //  -> S expr  : ($set name ($add name 1))
        checkParamsLength('$incl', list, 2, 2);

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], 1],
        ];
    },
}, {
    name: '++',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (++ name)
        //  -> S expr  : ($set name ($add name 1))
        checkParamsLength('++', list, 2, 2);

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], 1],
        ];
    },
}, {
    name: '$decl',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($decl name)
        //  -> S expr  : ($set name ($add name -1))
        checkParamsLength('$decl', list, 2, 2);

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], -1],
        ];
    },
}, {
    name: '--',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (-- name)
        //  -> S expr  : ($set name ($add name -1))
        checkParamsLength('--', list, 2, 2);

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], -1],
        ];
    },
}, {
    name: '$incln',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($incln name v)
        //  -> S expr  : ($set name ($add name v))
        checkParamsLength('$incln', list, 3, 3);
        if (typeof list[2] !== 'number') {
            throw new Error(`[SX] $incln: Invalid parameter: arg(1) is not number.`);
        }

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], list[2]],
        ];
    },
}, {
    name: '+=',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (++ name)
        //  -> S expr  : ($set name ($add name v))
        checkParamsLength('+=', list, 3, 3);
        if (typeof list[2] !== 'number') {
            throw new Error(`[SX] +=: Invalid parameter: arg(1) is not number.`);
        }

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], list[2]],
        ];
    },
}, {
    name: '$decln',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($decln name v)
        //  -> S expr  : ($set name ($add name -v))
        checkParamsLength('$decln', list, 3, 3);
        if (typeof list[2] !== 'number') {
            throw new Error(`[SX] $decln: Invalid parameter: arg(1) is not number.`);
        }

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], -(list[2] as number)],
        ];
    },
}, {
    name: '-=',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (-- name)
        //  -> S expr  : ($set name ($add name -v))
        checkParamsLength('-=', list, 3, 3);
        if (typeof list[2] !== 'number') {
            throw new Error(`[SX] -=: Invalid parameter: arg(1) is not number.`);
        }

        return [{symbol: '$set'},
            list[1],
            [{symbol: '$add'}, list[1], -(list[2] as number)],
        ];
    },
}];


export default macros;
