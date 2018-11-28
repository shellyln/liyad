// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxParserState,
         quote,
         isSymbol }          from '../../types';
import { checkParamsLength } from '../../errors';



export const macros: SxMacroInfo[] = [{
    name: '$scope',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($scope isBlockLocal returnMultiple ((name value) | name ...) expr ... expr)
        //  -> S expr  : ($__scope isBlockLocal returnMultiple '((name value) | name ...) 'expr ... 'expr)
        return [{symbol: '$__scope'},
            list[1],
            list[2],
            ...(list.slice(3).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$local',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($local ((name value) | name ...) expr ... expr)
        //  -> S expr  : ($__scope isBlockLocal=true returnMultiple=false '((name value) | name ...) 'expr ... 'expr)
        return [{symbol: '$__scope'},
            true,
            false,
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$global',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($__global expr1 ... exprN)
        //  -> S expr  : ($__global returnMultiple=false 'expr ... 'expr)
        return [{symbol: '$__global'},
            false,
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$clisp-let', // alias of $local
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($clisp-let ((name value) | name ...) expr ... expr)
        //  -> S expr  : ($__scope isBlockLocal=true returnMultiple=false '((name value) | name ...) 'expr ... 'expr)
        return [{symbol: '$__scope'},
            true,
            false,
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$capture',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($capture (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($__capture '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$__capture'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$closure',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($closure (sym1 ... symN) use (u-sym1 ... u-symM) expr ... expr)
        //  -> S expr  : ($__capture '(u-sym1 ... u-symM) ($__lambda '(sym1 ... symN) 'expr ... 'expr) )
        const symUse = isSymbol(list[2], 'use');
        if (! symUse) {
            throw new Error(`[SX] $closure: Invalid syntax: missing 'use' keyword.`);
        }
        return [{symbol: '$__capture'}, quote(state, list[3]), quote(state, [{symbol: '$__lambda'},
            quote(state, list[1]),
            ...(list.slice(4).map(x => quote(state, x))),
        ])];
    },
}, {
    name: '|->',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (|-> (sym1 ... symN) use (u-sym1 ... u-symM) expr ... expr)
        //  -> S expr  : ($closure (sym1 ... symN) use (u-sym1 ... u-symM) expr ... expr)
        return [{symbol: '$closure'},
            ...list.slice(1),
        ];
    },
}, {
    name: '$$closure',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($$closure (sym1 ... symN) use (u-sym1 ... u-symM) expr ... expr)
        //  -> S expr  : ($__capture '(u-sym1 ... u-symM) ($$__lambda '(sym1 ... symN) 'expr ... 'expr) )
        const symUse = isSymbol(list[2], 'use');
        if (! symUse) {
            throw new Error(`[SX] $closure: Invalid syntax: missing 'use' keyword.`);
        }
        return [{symbol: '$__capture'}, quote(state, list[3]), quote(state, [{symbol: '$$__lambda'},
            quote(state, list[1]),
            ...(list.slice(4).map(x => quote(state, x))),
        ])];
    },
}, {
    name: '|=>',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (|-> (sym1 ... symN) use (u-sym1 ... u-symM) expr ... expr)
        //  -> S expr  : ($closure (sym1 ... symN) use (u-sym1 ... u-symM) expr ... expr)
        return [{symbol: '$$closure'},
            ...list.slice(1),
        ];
    },
}, {
    name: '$lambda',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($lambda (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($__lambda '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$__lambda'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '->',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($lambda (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($__lambda '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$__lambda'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$$lambda',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($$lambda (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($$__lambda '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$$__lambda'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '=>',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($$lambda (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($$__lambda '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$$__lambda'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$defun',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($defun name (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($__defun 'name '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$__defun'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$$defun',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($$defun name (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($$__defun 'name '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$$__defun'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$refun',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($refun name)
        //  -> S expr  : ($__refun 'name)
        return [{symbol: '$__refun'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '<-',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (<- name)
        //  -> S expr  : ($__refun 'name)
        return [{symbol: '$__refun'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$defmacro',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($defmacro name (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($__defmacro 'name '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$__defmacro'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$call',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($call thisArg symbol arg1 ... argN)
        //  -> S expr  : ($__call thisArg 'symbol arg1 ... argN)
        checkParamsLength('$call', list, 3);

        return [{symbol: '$__call'},
            list[1],
            quote(state, list[2]),
            ...(list.slice(3)),
        ];
    },
}, {
    name: '$try',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($try expr catch-expr)
        //  -> S expr  : ($__try 't-expr 'catch-expr)
        return [{symbol: '$__try'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$if',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($if cond t-expr f-expr)
        //  -> S expr  : ($__if cond 't-expr 'f-expr)
        return [{symbol: '$__if'},
            list[1],
            ...(list.slice(2).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$if-null',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($if-null cond null-expr)
        //  -> S expr  : ($__if-null cont 'null-expr)
        return [{symbol: '$__if-null'},
            list[1],
            ...(list.slice(2).map(x => quote(state, x))),
        ];
    },
}, {
    name: '??',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (?? cond null-expr)
        //  -> S expr  : ($__if-null cont 'null-expr)
        return [{symbol: '$__if-null'},
            list[1],
            ...(list.slice(2).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$cond',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($cond cond1 expr1 ... condN exprN)
        //  -> S expr  : ($__cond 'cond1 'expr1 ... 'condN 'exprN)
        return [{symbol: '$__cond'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$while',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($while condition expr1 exprN)
        //  -> S expr  : ($__while 'condition 'expr1 'exprN)
        return [{symbol: '$__while'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$do-while',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($do-while condition expr1 exprN)
        //  -> S expr  : ($__do-while 'condition 'expr1 'exprN)
        return [{symbol: '$__do-while'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$until',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($until condition expr1 exprN)
        //  -> S expr  : ($__until 'condition 'expr1 'exprN)
        return [{symbol: '$__until'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$do-until',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($do-until condition expr1 exprN)
        //  -> S expr  : ($__do-until 'condition 'expr1 'exprN)
        return [{symbol: '$__do-until'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$repeat',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($repeat i of n-times expr1 exprN)
        //  -> S expr  : ($__repeat 'i n-times 'expr1 'exprN)
        const symOf = isSymbol(list[2], 'of');
        if (! symOf) {
            throw new Error(`[SX] $repeat: Invalid syntax: missing 'of' keyword.`);
        }
        return [{symbol: '$__repeat'},
            quote(state, list[1]),
            list[3],
            ...(list.slice(4).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$for',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($for x of list expr1 exprN)
        //  -> S expr  : ($__for 'x list 'expr1 'exprN)
        const symOf = isSymbol(list[2], 'of');
        if (! symOf) {
            throw new Error(`[SX] $for: Invalid syntax: missing 'of' keyword.`);
        }
        return [{symbol: '$__for'},
            quote(state, list[1]),
            list[3],
            ...(list.slice(4).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$get',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($get nameOrIndex1 ... nameOrIndexN)
        //  -> S expr  : ($__get 'nameOrIndex1 ... 'nameOrIndexN)
        return [{symbol: '$__get'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$let',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($let nameStrOrSymbol expr)
        //  -> S expr  : ($__let 'nameStrOrSymbol expr)
        checkParamsLength('$let', list, 3, 3);

        return [{symbol: '$__let'},
            quote(state, list[1]),
            list[2],
        ];
    },
}, {
    name: '$clisp-defvar',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($let nameStrOrSymbol expr)
        //  -> S expr  : ($__let 'nameStrOrSymbol expr)
        checkParamsLength('$clisp-defvar', list, 3, 3);

        return [{symbol: '$global'},
            [{symbol: '$__let'},
                quote(state, list[1]),
                list[2]
            ],
        ];
    },
}, {
    name: '$set',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($set nameOrListOfNameOrIndex expr)
        //  -> S expr  : ($__set 'nameOrListOfNameOrIndex expr)
        checkParamsLength('$set', list, 3, 3);

        return [{symbol: '$__set'},
            quote(state, list[1]),
            list[2],
        ];
    },
}, {
    name: '$clisp-setq', // alias of $set
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($clisp-setq symbol expr)
        //  -> S expr  : ($__set 'symbol expr)
        checkParamsLength('$clisp-setq', list, 3, 3);

        return [{symbol: '$__set'},
            quote(state, list[1]),
            list[2],
        ];
    },
}, {
    name: '$and',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($and expr1 ... exprN)
        //  -> S expr  : ($__and 'expr1 ... 'exprN)
        return [{symbol: '$__and'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '$or',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($or expr1 ... exprN)
        //  -> S expr  : ($__or 'expr1 ... 'exprN)
        return [{symbol: '$__or'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}, {
    name: '#',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: (# (name value...)...)
        //  -> S expr  : ($__# '(name value...)...)
        return [
            {symbol: '$__#'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}];


export default macros;
