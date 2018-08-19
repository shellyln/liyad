// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState }     from '../types';
import { toNumber }          from '../evaluate';
import { checkParamsLength } from '../errors';
import { $$first,
         $$firstAndSecond }  from './core.fn';



export const $bitLShift = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (<< number shift)
    //  -> S expr  : number
    checkParamsLength('$bitLShift', args, 2, 2);

    let {car, cdr} = $$firstAndSecond(...args);
    car = toNumber(car);
    cdr = toNumber(cdr);

    if (0 <= cdr) {
        return cdr < 32 ? car << cdr : 0;
    } else {
        return cdr > -32 ? car >>> (-cdr) : 0;
    }
};
export const $$bitLShift = $bitLShift(null as any, null as any);


export const $bitSRShift = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (>> number shift)
    //  -> S expr  : number
    checkParamsLength('$bitSRShift', args, 2, 2);

    let {car, cdr} = $$firstAndSecond(...args);
    car = toNumber(car);
    cdr = toNumber(cdr);

    if (0 <= cdr) {
        return cdr < 32 ? car >> cdr : (car & 0x080000000) ? -1 : 0;
    } else {
        return cdr > -32 ? car << (-cdr) : 0;
    }
};
export const $$bitSRShift = $bitSRShift(null as any, null as any);


export const $bitURShift = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (>>> number shift)
    //  -> S expr  : number
    checkParamsLength('$bitURShift', args, 2, 2);

    let {car, cdr} = $$firstAndSecond(...args);
    car = toNumber(car);
    cdr = toNumber(cdr);

    if (0 <= cdr) {
        return cdr < 32 ? car >>> cdr : 0;
    } else {
        return cdr > -32 ? car << (-cdr) : 0;
    }
};
export const $$bitURShift = $bitURShift(null as any, null as any);


export const $bitNot = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-not number)
    //  -> S expr  : number
    checkParamsLength('$bitNot', args, 1, 1);

    const car = $$first(...args);
    return ~toNumber(car);
};
export const $$bitNot = $bitNot(null as any, null as any);


export const $bitAnd = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-and numberA numberB)
    //  -> S expr  : number
    checkParamsLength('$bitAnd', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) & toNumber(curr), toNumber(car));
};
export const $$bitAnd = $bitAnd(null as any, null as any);


export const $bitOr = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-or numberA numberB)
    //  -> S expr  : number
    checkParamsLength('$bitOr', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) | toNumber(curr), toNumber(car));
};
export const $$bitOr = $bitOr(null as any, null as any);


export const $bitXor = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-xor numberA numberB)
    //  -> S expr  : number
    checkParamsLength('$bitXor', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) ^ toNumber(curr), toNumber(car));
};
export const $$bitXor = $bitXor(null as any, null as any);


export const $add = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (+ number1 ... numberN)
    //  -> S expr  : number
    checkParamsLength('$add', args, 1);

    return args.reduce((prev, curr) => toNumber(prev) + toNumber(curr), 0);
};
export const $$add = $add(null as any, null as any);


export const $sub = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (- number1 ... numberN)
    //  -> S expr  : number
    checkParamsLength('$sub', args, 1);

    const car = $$first(...args);
    const last = args.slice(1);
    if (last.length === 0) {
        // negate
        return -toNumber(car);
    } else {
        // subtract
        return args.slice(1).reduce((prev, curr) => toNumber(prev) - toNumber(curr), toNumber(car));
    }
};
export const $$sub = $sub(null as any, null as any);


export const $mul = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (* number1 ... numberN)
    //  -> S expr  : number
    checkParamsLength('$mul', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) * toNumber(curr), toNumber(car));
};
export const $$mul = $mul(null as any, null as any);


export const $sup = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (** number1 ... numberN)
    //  -> S expr  : number
    checkParamsLength('$sup', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) ** toNumber(curr), toNumber(car));
};
export const $$sup = $sup(null as any, null as any);


export const $div = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (/ number1 ... numberN)
    //  -> S expr  : number
    checkParamsLength('$div', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) / toNumber(curr), toNumber(car));
};
export const $$div = $div(null as any, null as any);


export const $mod = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (% number1 ... numberN)
    //  -> S expr  : number
    checkParamsLength('$mod', args, 2);

    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => toNumber(prev) % toNumber(curr), toNumber(car));
};
export const $$mod = $mod(null as any, null as any);


export const $max = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($max val1 ... valN)
    //  -> S expr  : value
    return Math.max(...(args.map(x => toNumber(x))));
};
export const $$max = $max(null as any, null as any);


export const $min = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($min val1 ... valN)
    //  -> S expr  : value
    return Math.min(...(args.map(x => toNumber(x))));
};
export const $$min = $min(null as any, null as any);


export const $avg = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($avg val1 ... valN)
    //  -> S expr  : value
    const a = args.map(x => toNumber(x));
    return a.length > 0 ? a.reduce((prev, curr) => prev + curr, 0) / a.length : NaN;
};
export const $$avg = $avg(null as any, null as any);


export const $floor = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($floor number)
    //  -> S expr  : number
    checkParamsLength('$floor', args, 1, 1);

    return Math.floor(toNumber($$first(...args)));
};
export const $$floor = $floor(null as any, null as any);


export const $ceil = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($ceil number)
    //  -> S expr  : number
    checkParamsLength('$ceil', args, 1, 1);

    return Math.ceil(toNumber($$first(...args)));
};
export const $$ceil = $ceil(null as any, null as any);


export const $round = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($round number)
    //  -> S expr  : number
    checkParamsLength('$round', args, 1, 1);

    return Math.round(toNumber($$first(...args)));
};
export const $$round = $round(null as any, null as any);


export const $abs = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($abs number)
    //  -> S expr  : number
    checkParamsLength('$abs', args, 1, 1);

    return Math.abs(toNumber($$first(...args)));
};
export const $$abs = $abs(null as any, null as any);


export const $sign = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($sign number)
    //  -> S expr  : number
    checkParamsLength('$sign', args, 1, 1);

    return Math.sign(toNumber($$first(...args)));
};
export const $$sign = $sign(null as any, null as any);
