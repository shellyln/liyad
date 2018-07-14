// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxSymbol,
         SxToken,
         isSymbol,
         quote }              from '../types';
import { evaluate,
         resolveValueSymbol,
         resolveValueSymbolScope,
         getGlobalScope,
         installScope,
         uninstallScope,
         optimizeTailCall}    from '../evaluate';



export const $car = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($car atomOrNilOrNull arg2 ... argN)
    //  -> S expr  : null
    // S expression: ($car '(first second ... last) arg2 ... argN)
    //  -> S expr  : first
    const arg0: any = args.slice(0, 1);
    const car: any = (arg0.length === 1 && Array.isArray(arg0)) ? arg0.slice(0, 1) : [];
    return (car.length === 1) ? car[0] : null;
};
export const $$car = $car(null as any, null as any);


export const $cdr = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($cdr atomOrNilOrNull arg2 ... argN)
    //  -> S expr  : null
    // S expression: ($cdr '(first second ... last) arg2 ... argN)
    //  -> S expr  : (second ... last)
    // S expression: ($cdr '(first) arg2 ... argN)
    //  -> S expr  : null
    const arg0: any = args.slice(0, 1);
    let cdr: any = (arg0.length === 1 && Array.isArray(arg0)) ? args.slice(1) : [];
    if (cdr.length === 0) {
        cdr = null;
    }
    return cdr;
};
export const $$cdr = $cdr(null as any, null as any);


export const $cons = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($cons arg1 '(arg2-item1 ...) ... argN)
    //  -> S expr  : (arg1 arg2-item1 ...)
    // S expression: ($cons arg1 nilOrNull ... argN)
    //  -> S expr  : (arg1)
    // S expression: ($cons arg1 arg2 ... argN)
    //  -> S expr  : arg1.arg2
    let car: any = args.slice(0, 1);
    car = (car.length === 1) ? car[0] : null;

    let cdr: any = args.slice(1, 2);
    cdr = (cdr.length === 1) ? cdr[0] : null;

    if (Array.isArray(cdr)) {
        cdr.unshift(car);
        return cdr;
    } else if (cdr === null) {
        return [car];
    } else {
        return {car, cdr};
    }
};
export const $$cons = $cons(null as any, null as any);


export const $first = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($first first second ... last)
    //  -> S expr  : first
    // S expression: ($first)
    //  -> S expr  : null
    const car: any = args.slice(0, 1);
    return (car.length === 1) ? car[0] : null;
};
export const $$first = $first(null as any, null as any);


export const $second = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($second first second ... last)
    //  -> S expr  : second
    // S expression: ($second first)
    //  -> S expr  : null
    const cdr: any = args.slice(1, 2);
    return (cdr.length === 1) ? cdr[0] : null;
};
export const $$second = $second(null as any, null as any);


export const $rest = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($rest first second ... last)
    //  -> S expr  : (second ... last)
    // S expression: ($rest first)
    //  -> S expr  : null
    const cdr: any = args.slice(1);
    return (0 < cdr.length) ? cdr : null;
};
export const $$rest = $rest(null as any, null as any);


export const $firstAndSecond = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($car first second ... last)
    //  -> S expr  : first.second
    let car: any = args.slice(0, 1);
    car = (car.length === 1) ? car[0] : null;

    let cdr: any = args.slice(1, 2);
    cdr = (cdr.length === 1) ? cdr[0] : null;

    return {car, cdr};
};
export const $$firstAndSecond = $firstAndSecond(null as any, null as any);


export const $atom = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($atom arg1 ...)
    //  -> (if arg1 is list or dotted pair)  S expr  : false
    //  -> (if arg1 is nil or anything else) S expr  : true
    let car: any = args.slice(0, 1);
    car = (car.length === 1) ? car[0] : null;

    if (car === null || car === void 0) {
        return true;
    }

    if (Array.isArray(car)) {
        if (car.length === 0) return  true;
        else                  return false;
    }

    switch (typeof car) {
    case 'number': case 'string': case 'function':
        return true;
    case 'object':
        return isSymbol(car);
    }
    return false;
};
export const $$atom = $atom(null as any, null as any);


export const $eq = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($eq arg1 arg2 ...)
    //  -> (if arg1 === arg2)  S expr  : true
    //  -> (else)              S expr  : false
    const {car, cdr} = $$firstAndSecond(...args);
    return car === cdr;
};
export const $$eq = $eq(null as any, null as any);


export const $notEq = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($not-eq arg1 arg2 ...)
    //  -> (if arg1 !== arg2)  S expr  : true
    //  -> (else)              S expr  : false
    const {car, cdr} = $$firstAndSecond(...args);
    return car !== cdr;
};
export const $$notEq = $notEq(null as any, null as any);


export const $list = (state: SxParserState, name: string) => (...args: any[]) =>
    // S expression: ($list arg1 ... argN)
    //  -> S expr  : (arg1 ... argN)
    args.slice(0);
export const $$list = $list(null as any, null as any);


// tslint:disable-next-line:variable-name
export const $__scope = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__scope isBlockLocal returnMultiple '((name value) | name ...) 'expr1 ... 'exprN)
    //  -> (if returnMultiple)  S expr  : [expr1 ... exprN]
    //  -> (else)               S expr  : exprN
    const isBlockLocal = $$first(...args);
    const returnMultiple = $$second(...args);
    const {car, cdr} = $$firstAndSecond(...args.slice(2));
    let r: SxToken = null;

    try {
        const scope: any = {};
        if (Array.isArray(car)) {
            for (const x of car) {
                if (Array.isArray(x)) {
                    const kv = $$firstAndSecond(...x);
                    const kvSym = isSymbol(kv.car);
                    scope[kvSym ? kvSym.symbol : String(kv.car)] = evaluate(state, kv.cdr);
                } else {
                    const xSym = isSymbol(x);
                    scope[xSym ? xSym.symbol : String(x)] = null;
                }
            }
        }
        installScope(state, scope, isBlockLocal);

        if (4 < args.length) {
            if (returnMultiple) {
                r = [];
                for (const x of args.slice(3)) {
                    r.push(evaluate(state, x));
                }
            } else {
                for (const x of args.slice(3)) {
                    r = evaluate(state, x);
                }
            }
        } else {
            r = evaluate(state, cdr);
        }
    } finally {
        uninstallScope(state);
    }

    return r;
};


// tslint:disable-next-line:variable-name
export const $__globalScope = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__global returnMultiple 'expr1 ... 'exprN)
    //  -> (if returnMultiple)  S expr  : [expr1 ... exprN]
    //  -> (else)               S expr  : exprN
    const returnMultiple = $$first(...args);
    const {car, cdr} = $$firstAndSecond(...args.slice(2));
    let r: SxToken = null;

    try {
        installScope(state, getGlobalScope(state), true);

        if (2 < args.length) {
            if (returnMultiple) {
                r = [];
                for (const x of args.slice(1)) {
                    r.push(evaluate(state, x));
                }
            } else {
                for (const x of args.slice(1)) {
                    r = evaluate(state, x);
                }
            }
        } else {
            r = evaluate(state, cdr);
        }
    } finally {
        uninstallScope(state);
    }

    return r;
};


// tslint:disable-next-line:variable-name
export const $__lambda = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__lambda '(sym1 ... symN) 'expr1 ... 'exprN)
    //  -> S expr  : fn
    if (args.length < 2) {
        throw new Error(`[SX] $__lambda: Invalid argument length: expected: ${3} / args: ${args.length}.`);
    }

    const formalArgs: SxSymbol[] = args[0];
    if (! Array.isArray(formalArgs)) {
        throw new Error(`[SX] $__lambda: Invalid argument(s): args[0] is not array.`);
    }
    for (const fa of formalArgs) {
        if (! isSymbol(fa)) {
            throw new Error(`[SX] $__lambda: Invalid argument(s): item(s) of args[0] is not symbol.`);
        }
    }

    let fnBody = args.slice(1);
    if (state.config.enableTailCallOptimization) {
        fnBody = optimizeTailCall(state, formalArgs, fnBody);
    }

    const fn = (...actualArgs: any[]) => {
        if (actualArgs.length < formalArgs.length) {
            throw new Error(`[SX] func call: Actual args too short: actual ${
                actualArgs.length} / formal ${formalArgs.length}.`);
        }
        return $__scope(state, name)(false, false, [
            [state.config.reservedNames.self, fn],
            ...(formalArgs.map((x: SxSymbol, index) => {
                return [x.symbol, quote(state, actualArgs[index])];
            })),
        ], ...fnBody);
    };
    return fn;
};


// tslint:disable-next-line:variable-name
export const $__defun = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__defun 'name '(sym1 ... symN) 'expr ... 'expr)
    //  -> S expr  : fn
    const car: SxSymbol = $$first(...args);
    if (args.length < 3) {
        throw new Error(`[SX] $__defun: Invalid argument length: expected: ${3} / args: ${args.length}.`);
    }
    const fn = $__lambda(state, name)(...args.slice(1));
    state.funcMap.set(car.symbol, {
        name: car.symbol,
        fn: (st, nm) => fn
    });
    return fn;
};


// tslint:disable-next-line:variable-name
export const $__if = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__if condition 't-expr 'f-expr)
    //  -> (if condition is true ) S expr  : t-expr
    //  -> (if condition is false) S expr  : f-expr
    const car = $$first(...args);
    let r: SxToken = [];
    if ($$boolean(car)) {
        r = evaluate(state, args[1]);
    } else {
        r = evaluate(state, args[2]);
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__cond = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__cond 'cond1 'expr1 ... 'condN 'exprN)
    //  -> (if (eval condI) is true ) S expr  : exprI
    //  -> (if no matched)            S expr  : null
    for (let i = 0; i < args.length - 1; i += 2) {
        const c = args[i];
        const x = args[i + 1];
        if ($$boolean(evaluate(state, c))) {
            return evaluate(state, x);
        }
    }
    return null;
};


// tslint:disable-next-line:variable-name
export const $__while = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__while 'condition 'expr1 'exprN)
    //  -> (if condition is true at least 1 or more times) S expr  : exprN
    //  -> (else)                                          S expr  : null
    const car = $$first(...args);
    const cdr = args.slice(1);
    let r: SxToken = null;
    while ($$boolean(evaluate(state, car))) {
        for (const x of cdr) {
            r = evaluate(state, x);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__doWhile = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__do-while 'condition 'expr1 'exprN)
    //  -> (if condition is true at least 1 or more times) S expr  : exprN
    //  -> (else)                                          S expr  : null
    const car = $$first(...args);
    const cdr = args.slice(1);
    let r: SxToken = null;

    do {
        for (const x of cdr) {
            r = evaluate(state, x);
        }
    } while ($$boolean(evaluate(state, car)));
    return r;
};


// tslint:disable-next-line:variable-name
export const $__until = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__until 'condition 'expr1 'exprN)
    //  -> (if condition is true at least 1 or more times) S expr  : exprN
    //  -> (else)                                          S expr  : null
    const car = $$first(...args);
    const cdr = args.slice(1);
    let r: SxToken = null;
    while ($$not(evaluate(state, car))) {
        for (const x of cdr) {
            r = evaluate(state, x);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__doUntil = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__do-until 'condition 'expr1 'exprN)
    //  -> (if condition is true at least 1 or more times) S expr  : exprN
    //  -> (else)                                          S expr  : null
    const car = $$first(...args);
    const cdr = args.slice(1);
    let r: SxToken = null;
    do {
        for (const x of cdr) {
            r = evaluate(state, x);
        }
    } while ($$not(evaluate(state, car)));
    return r;
};


// tslint:disable-next-line:variable-name
export const $__repeat = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__repeat 'i n-times 'expr1 'exprN)
    //  -> (if n > 0) S expr  : exprN
    //  -> (else)     S expr  : null
    const sym = isSymbol($$first(...args));
    if (! sym) {
        throw new Error(`[SX] $__repeat: Invalid argument(s): item(s) of args[0] is not symbol.`);
    }
    const scope = resolveValueSymbolScope(state, sym, false);

    const n = Number($$second(...args));
    const cdr = args.slice(2);
    let r: SxToken = null;
    for (let i = 0; i < n; i++) {
        scope[sym.symbol] = i;
        for (const x of cdr) {
            r = evaluate(state, x);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__for = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__for 'x list 'expr1 'exprN)
    //  -> (if list.length > 0) S expr  : exprN
    //  -> (else)               S expr  : null
    const sym = isSymbol($$first(...args));
    if (! sym) {
        throw new Error(`[SX] $__for: Invalid argument(s): item(s) of args[0] is not symbol.`);
    }
    const scope = resolveValueSymbolScope(state, sym, false);

    const list = Number($$second(...args));
    if (! Array.isArray(list)) {
        throw new Error(`[SX] $__for: Invalid argument(s): item(s) of args[1] is not array.`);
    }

    const cdr = args.slice(2);
    let r: SxToken = null;
    for (const q of list) {
        scope[sym.symbol] = q;
        for (const x of cdr) {
            r = evaluate(state, x);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__get = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__get 'nameOrIndex1 ... 'nameOrIndexN)
    //  -> S expr  : any
    if (args.length === 0) return null;

    let sym = isSymbol(args[0]);
    let v = resolveValueSymbol(state, sym ? sym : {symbol: String(args[0])});

    for (let i = 1; i < args.length; i++) {
        switch (typeof args[i]) {
        case 'object':
            sym = isSymbol(args[i]);
            if (sym) {
                v = v[evaluate(state, sym) as any];
            } else {
                throw new Error(`[SX] $__get: Invalid argument(s): invalid name path.`);
            }
            break;
        case 'string':
            v = v[args[i]];
            break;
        case 'number':
            if (args[i] >= 0) {
                v = v[args[i]];
            } else {
                v = v[v.length + args[i]];
            }
            break;
        default:
            throw new Error(`[SX] $__get: Invalid argument(s): invalid name path.`);
        }
    }
    return v;
};


// tslint:disable-next-line:variable-name
export const $__let = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__let 'nameStrOrSymbol expr)
    //  -> S expr  : any
    if (args.length < 2) return null;

    let sym = isSymbol($$first(...args));

    if (! sym) {
        if (typeof args[0] === 'string') {
            sym = {symbol: args[0]};
        } else {
            throw new Error(`[SX] $__let: Invalid argument(s): invalid name.`);
        }
    }

    const scope = resolveValueSymbolScope(state, sym, false);
    scope[sym.symbol] = args[1];

    return args[1];
};


// tslint:disable-next-line:variable-name
export const $__set = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__set 'nameOrListOfNameOrIndex expr)
    //  -> S expr  : any
    if (args.length < 2) return null;

    let path: any = [];
    if (Array.isArray(args[0])) {
        path = args[0];
    } else {
        path.push(args[0]);
    }

    let sym = isSymbol(path[0]);

    if (! sym) {
        if (typeof path[0] === 'string') {
            sym = {symbol: path[0]};
        } else {
            throw new Error(`[SX] $__set: Invalid argument(s): invalid name.`);
        }
    }

    let scope = resolveValueSymbolScope(state, sym, true);
    if (scope === null) {
        throw new Error(`[SX] $__set: Unresolved symbol: ${sym.symbol}.`);
    }

    let i = 0;
    for (; i < path.length - 1; i++) {
        switch (typeof path[i]) {
        case 'object':
            sym = isSymbol(path[i]);
            if (sym) {
                scope = scope[evaluate(state, sym) as any];
            } else {
                throw new Error(`[SX] $__set: Invalid argument(s): invalid name.`);
            }
            break;
        case 'string':
            scope = scope[path[i]];
            break;
        case 'number':
            if (path[i] >= 0) {
                scope = scope[path[i]];
            } else {
                scope = scope[scope.length + path[i]];
            }
            break;
        default:
            throw new Error(`[SX] $__set: Invalid argument(s): invalid name.`);
        }
    }

    for (; i < path.length; i++) {
        switch (typeof path[i]) {
        case 'object':
            sym = isSymbol(path[i]);
            if (sym) {
                scope[evaluate(state, sym) as any] = args[1];
            } else {
                throw new Error(`[SX] $__set: Invalid argument(s): invalid name.`);
            }
            break;
        case 'string':
            scope[path[i]] = args[1];
            break;
        case 'number':
            if (path[i] >= 0) {
                scope[path[i]] = args[1];
            } else {
                scope[scope.length + path[i]] = args[1];
            }
            break;
        default:
            throw new Error(`[SX] $__set: Invalid argument(s): invalid name.`);
        }
    }

    return args[1];
};


export const $boolean = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    if (Array.isArray(car) && car.length === 0) return false;
    else return Boolean(car);
};
export const $$boolean = $boolean(null as any, null as any);


export const $not = (state: SxParserState, name: string) => (...args: any[]) => {
    return ! $$boolean(...args);
};
export const $$not = $not(null as any, null as any);


export const $and = (state: SxParserState, name: string) => (...args: any[]) =>
    (args as any[]).reduce((prev, curr) => prev && curr, true);
export const $$and = $and(null as any, null as any);


export const $or = (state: SxParserState, name: string) => (...args: any[]) =>
    (args as any[]).reduce((prev, curr) => prev || curr, false);
export const $$or = $or(null as any, null as any);


export const $ambiguousEq = (state: SxParserState, name: string) => (...args: any[]) => {
    let {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car) && car.length === 0) car = null;
    if (Array.isArray(cdr) && cdr.length === 0) cdr = null;
    if (car === void 0) car = null;
    if (cdr === void 0) cdr = null;
    // tslint:disable-next-line:triple-equals
    return car == cdr;
};
export const $$ambiguousEq = $ambiguousEq(null as any, null as any);


export const $ambiguousNotEq = (state: SxParserState, name: string) => (...args: any[]) => {
    return ! $$ambiguousEq(...args);
};
export const $$ambiguousNotEq = $ambiguousNotEq(null as any, null as any);


export const $lt = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$firstAndSecond(...args);
    return Number(car) < Number(cdr);
};
export const $$lt = $lt(null as any, null as any);


export const $le = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$firstAndSecond(...args);
    return Number(car) <= Number(cdr);
};
export const $$le = $le(null as any, null as any);


export const $gt = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$firstAndSecond(...args);
    return Number(car) > Number(cdr);
};
export const $$gt = $gt(null as any, null as any);


export const $ge = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$firstAndSecond(...args);
    return Number(car) >= Number(cdr);
};
export const $$ge = $ge(null as any, null as any);


export const $isList = (state: SxParserState, name: string) => (...args: any[]) => {
    return Array.isArray($$first(...args));
};
export const $$isList = $isList(null as any, null as any);


export const $isString = (state: SxParserState, name: string) => (...args: any[]) => {
    return typeof $$first(...args) === 'string';
};
export const $$isString = $isString(null as any, null as any);


export const $isNumber = (state: SxParserState, name: string) => (...args: any[]) => {
    return typeof $$first(...args) === 'number';
};
export const $$isNumber = $isNumber(null as any, null as any);


export const $isNaN = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number.isNaN(Number($$first(...args)));
};
export const $$isNaN = $isNaN(null as any, null as any);


export const $isFinite = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number.isFinite(Number($$first(...args)));
};
export const $$isFinite = $isFinite(null as any, null as any);


export const $isInteger = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number.isInteger(Number($$first(...args)));
};
export const $$isInteger = $isInteger(null as any, null as any);


export const $toString = (state: SxParserState, name: string) => (...args: any[]) => {
    return String($$first(...args));
};
export const $$toString = $toString(null as any, null as any);


export const $toNumber = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number($$first(...args));
};
export const $$toNumber = $toNumber(null as any, null as any);
