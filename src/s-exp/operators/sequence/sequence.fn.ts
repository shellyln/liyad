// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState }     from '../../types';
import { toNumber,
         evaluate }          from '../../evaluate';
import { checkParamsLength } from '../../errors';
import { $$first,
         $$firstAndSecond }  from '../core/core.fn';
import { query }             from '../../../lib/data';



export const $range = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($range start end)
    // S expression: ($range start end step)
    //  -> S expr  : list
    checkParamsLength('$range', args, 2, 3);

    const {car, cdr} = $$firstAndSecond(...args);
    const start = toNumber(car) || 0;
    const stop = toNumber(cdr) || 0;

    const step = (args.length > 2 ? toNumber(args[2]) || 0 : 0) || (start <= stop ? 1 : -1);
    const n = Math.sign(stop - start) + Math.sign(step) !== 0 ?
        (Math.floor((Math.abs(stop - start) / Math.abs(step))) + 1) : 0;

    state.evalCount += n;
    evaluate(state, 0);
    return Array.from({length: n}, (x, i) => start + i * step);
};


export const $length = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($length listOrString)
    //  -> S expr  : number
    checkParamsLength('$length', args, 1, 1);

    const car = $$first(...args);
    switch (typeof car) {
    case 'object':
        if (! ('length' in car)) {
            break;
        }
        // FALL_THRU
    case 'string':
        return car.length;
    }
    throw new Error(`[SX] $length: Invalid argument type: object has no property 'length'.`);
};
export const $$length = $length(null as any, null as any);


export const $trim = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($trim string)
    //  -> S expr  : string
    checkParamsLength('$trim', args, 1, 1);

    const car = $$first(...args);
    if (typeof car === 'string') {
        return car.trim();
    }
    throw new Error(`[SX] $trim: Invalid argument type: args[0] is not string.`);
};
export const $$trim = $trim(null as any, null as any);


export const $trimHead = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($trim-head string)
    //  -> S expr  : string
    checkParamsLength('$trimHead', args, 1, 1);

    const car = $$first(...args);
    if (typeof car === 'string') {
        return car.trimLeft();
    }
    throw new Error(`[SX] $trimHead: Invalid argument type: args[0] is not string.`);
};
export const $$trimHead = $trimHead(null as any, null as any);


export const $trimTail = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($trim-tail string)
    //  -> S expr  : string
    checkParamsLength('$trimTail', args, 1, 1);

    const car = $$first(...args);
    if (typeof car === 'string') {
        return car.trimRight();
    }
    throw new Error(`[SX] $trimTail: Invalid argument type: args[0] is not string.`);
};
export const $$trimTail = $trimTail(null as any, null as any);


export const $replaceAll = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($replace-all src-string match-string replacement-string)
    //  -> S expr  : string
    checkParamsLength('$replaceAll', args, 3, 3);

    if (typeof args[0] === 'string' && typeof args[1] === 'string' && typeof args[2] === 'string') {
        return args[0].split(args[1]).join(args[2]);
    }
    throw new Error(`[SX] $replaceAll: Invalid argument type: args[0] or [1] or [2] is not string.`);
};
export const $$replaceAll = $replaceAll(null as any, null as any);


export const $split = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($split src-string match-string)
    //  -> S expr  : (string ... string)
    checkParamsLength('$split', args, 2, 2);

    if (typeof args[0] === 'string' && typeof args[1] === 'string') {
        return args[0].split(args[1]);
    }
    throw new Error(`[SX] $split: Invalid argument type: args[0] or [1] is not string.`);
};
export const $$split = $split(null as any, null as any);


export const $join = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($join '(str1 ... strN) separator)
    //  -> S expr  : (string ... string)
    checkParamsLength('$join', args, 1, 2);

    if (typeof Array.isArray(args[0])) {
        if (args.length > 1) {
            if (typeof args[1] === 'string') {
                return args[0].join(args[1]);
            }
            throw new Error(`[SX] $join: Invalid argument type: args[1] is not string.`);
        } else {
            return args[0].join();
        }
    }
    throw new Error(`[SX] $join: Invalid argument type: args[0] is not array.`);
};
export const $$join = $join(null as any, null as any);


export const $concat = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($concat listOrString1 ... listOrStringN)
    //  -> S expr  : listOrString
    checkParamsLength('$concat', args, 1);

    const car = $$first(...args);
    switch (typeof car) {
    case 'object':
        if (! ('concat' in car)) {
            break;
        }
        // FALL_THRU
    case 'string':
        return car.concat(...args.slice(1));
    }
    throw new Error(`[SX] $concat: Invalid argument type: object has no property 'concat'.`);
};
export const $$concat = $concat(null as any, null as any);


export const $slice = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($slice start end listOrString)
    // S expression: ($slice start listOrString)
    //  -> S expr  : listOrString
    checkParamsLength('$slice', args, 2, 3);

    if (args.length === 3) {
        if (typeof args[2] === 'string' || Array.isArray(args[2])) {
            return args[2].slice(toNumber(args[0]), toNumber(args[1]));
        }
    }
    if (args.length === 2) {
        if (typeof args[1] === 'string' || Array.isArray(args[1])) {
            return args[1].slice(toNumber(args[0]));
        }
    }
    throw new Error(`[SX] $slice: Invalid argument type: args[${args.length - 1}] is not string or array.`);
};
export const $$slice = $slice(null as any, null as any);


export const $top = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($top n listOrString)
    //  -> S expr  : listOrString
    checkParamsLength('$top', args, 2, 2);

    if (typeof args[1] === 'string' || Array.isArray(args[1])) {
        return args[1].slice(0, toNumber(args[0]));
    }
    throw new Error(`[SX] $top: Invalid argument type: args[1] is not string or array.`);
};
export const $$top = $top(null as any, null as any);


export const $tail = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($tail n listOrString)
    //  -> S expr  : listOrString
    checkParamsLength('$tail', args, 2, 2);

    if (typeof args[1] === 'string' || Array.isArray(args[1])) {
        const n = -toNumber(args[0]);
        return args[1].slice(n >= 0 || Number.isNaN(n) ? args[1].length : n);
    }
    throw new Error(`[SX] $tail: Invalid argument type: args[1] is not string or array.`);
};
export const $$tail = $tail(null as any, null as any);


export const $push = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($push list value)
    //  -> S expr  : list
    checkParamsLength('$push', args, 2, 2);

    if (typeof Array.isArray(args[0])) {
        args[0].push(args[1]);
        return args[0];
    }
    throw new Error(`[SX] $push: Invalid argument type: args[1] is not array.`);
};
export const $$push = $push(null as any, null as any);


export const $pop = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($pop list)
    //  -> S expr  : value
    checkParamsLength('$pop', args, 1, 1);

    if (typeof Array.isArray(args[0])) {
        const v = args[0].pop();
        return v;
    }
    throw new Error(`[SX] $pop: Invalid argument type: args[1] is not array.`);
};
export const $$pop = $pop(null as any, null as any);


// tslint:disable-next-line:variable-name
export const $__at = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__at index listOrString)
    //  -> S expr  : any
    checkParamsLength('$__at', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    return cdr[car];
};
// tslint:disable-next-line:variable-name
export const $$__at = $__at(null as any, null as any);


export const $reverse = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reverse listOrString)
    //  -> S expr  : listOrString
    checkParamsLength('$reverse', args, 1, 1);

    const car = $$first(...args);
    if (Array.isArray(car)) {
        return car.slice(0).reverse();
    }
    throw new Error(`[SX] $reverse: Invalid argument type: args[0] is not array.`);
};
export const $$reverse = $reverse(null as any, null as any);


export const $reverseDestructive = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reverse! listOrString)
    //  -> S expr  : listOrString
    checkParamsLength('$reverse!', args, 1, 1);

    const car = $$first(...args);
    if (Array.isArray(car)) {
        return car.reverse();
    }
    throw new Error(`[SX] $reverse!: Invalid argument type: args[0] is not array.`);
};
export const $$reverseDestructive = $reverseDestructive(null as any, null as any);


export const $find = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($find list (lambda (v index array) (... boolean)))
    //  -> S expr  : list
    checkParamsLength('$find', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        return car.find(cdr);
    }
    throw new Error(`[SX] $find: Invalid argument type: args[0] is not array.`);
};
export const $$find = $find(null as any, null as any);


export const $filter = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($filter list (lambda (v index array) (... boolean)))
    //  -> S expr  : list
    checkParamsLength('$filter', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        return car.filter(cdr);
    }
    throw new Error(`[SX] $filter: Invalid argument type: args[0] is not array.`);
};
export const $$filter = $filter(null as any, null as any);


export const $map = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($map list (lambda (v index array) (... any)))
    //  -> S expr  : list
    checkParamsLength('$map', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        return car.map(cdr);
    }
    throw new Error(`[SX] $map: Invalid argument type: args[0] is not array.`);
};
export const $$map = $map(null as any, null as any);


export const $reduce = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reduce list (lambda (acc v index array) (... any)) initial-value)
    // S expression: ($reduce list (lambda (acc v index array) (... any)))
    //  -> S expr  : list
    checkParamsLength('$reduce', args, 2, 3);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        if (args.length < 3) {
            return car.reduce(cdr);
        } else {
            return car.reduce(cdr, args[2]);
        }
    }
    throw new Error(`[SX] $reduce: Invalid argument type: args[0] is not array.`);
};
export const $$reduce = $reduce(null as any, null as any);


export const $reduceFromTail = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reduce-from-tail list (lambda (acc v index array) (... any)) initial-value)
    // S expression: ($reduce-from-tail list (lambda (acc v index array) (... any)))
    //  -> S expr  : list
    checkParamsLength('$reduceFromTail', args, 2, 3);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        if (args.length < 3) {
            return car.reduceRight(cdr);
        } else {
            return car.reduceRight(cdr, args[2]);
        }
    }
    throw new Error(`[SX] $reduceFromTail: Invalid argument type: args[0] is not array.`);
};
export const $$reduceFromTail = $reduceFromTail(null as any, null as any);


export const $sort = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($sort list (lambda (a b) (... number_a-b)))
    //  -> S expr  : list
    checkParamsLength('$sort', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        return car.slice(0).sort(cdr);
    }
    throw new Error(`[SX] $sort: Invalid argument type: args[0] is not array.`);
};
export const $$sort = $sort(null as any, null as any);


export const $sortDestructive = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($sort! list (lambda (a b) (... number_a-b)))
    //  -> S expr  : list
    checkParamsLength('$sort!', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (Array.isArray(car)) {
        return car.sort(cdr);
    }
    throw new Error(`[SX] $sort!: Invalid argument type: args[0] is not array.`);
};
export const $$sortDestructive = $sortDestructive(null as any, null as any);


export const $groupEvery = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($group-every optionsOrNumber (x1 ... xN))
    //  -> S expr  : ((x1 ... ) ... ( ... xN))
    checkParamsLength('$group-every', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (! Array.isArray(cdr)) {
        throw new Error(`[SX] $group-every: Invalid argument type: args[1] is not array.`);
    }

    return query(cdr as any[]).groupEvery(car).select();
};
export const $$groupEvery = $groupEvery(null as any, null as any);


export const $groupBy = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($group-by conditions (x1 ... xN))
    //  -> S expr  : ((x1 ... ) ... ( ... xN))
    checkParamsLength('$group-by', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (! Array.isArray(cdr)) {
        throw new Error(`[SX] $group-by: Invalid argument type: args[1] is not array.`);
    }

    return query(cdr as any[]).groupBy(car).select();
};
export const $$groupBy = $groupBy(null as any, null as any);


export const $orderBy = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($order-by conditions (x1 ... xN))
    //  -> S expr  : (x1 ... xN)
    checkParamsLength('$order-by', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (! Array.isArray(cdr)) {
        throw new Error(`[SX] $order-by: Invalid argument type: args[1] is not array.`);
    }

    return query(cdr as any[]).orderBy(car).select();
};
export const $$orderBy = $orderBy(null as any, null as any);


export const $where = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($where (-> (v index array) ... boolean) (x1 ... xN))
    //  -> S expr  : (x'1 ... x'M)
    checkParamsLength('$where', args, 2, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    if (typeof args[0] !== 'function') {
        throw new Error(`[SX] $where: Invalid argument type: args[0] is not function.`);
    }
    if (! Array.isArray(cdr)) {
        throw new Error(`[SX] $where: Invalid argument type: args[1] is not array.`);
    }

    return query(cdr as any[]).where(car).select();
};
export const $$where = $where(null as any, null as any);
