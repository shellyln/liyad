// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState } from '../types';
import { $$first }       from './core.fn';



export const $bitNot = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-not number)
    //  -> S expr  : number
    const car = $$first(...args);
    return ~Number(car);
};
export const $$bitNot = $bitNot(null as any, null as any);


export const $bitAnd = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-and numberA numberB)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) & Number(curr), Number(car));
};
export const $$bitAnd = $bitAnd(null as any, null as any);


export const $bitOr = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-or numberA numberB)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) | Number(curr), Number(car));
};
export const $$bitOr = $bitOr(null as any, null as any);


export const $bitXor = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($bit-xor numberA numberB)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) ^ Number(curr), Number(car));
};
export const $$bitXor = $bitXor(null as any, null as any);


export const $add = (state: SxParserState, name: string) => (...args: any[]) =>
    // S expression: (+ number1 ... numberN)
    //  -> S expr  : number
    args.reduce((prev, curr) => Number(prev) + Number(curr), 0);
export const $$add = $add(null as any, null as any);


export const $sub = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (- number1 ... numberN)
    //  -> S expr  : number
    const car = $$first(...args);
    const last = args.slice(1);
    if (last.length === 0) {
        // negate
        return -Number(car);
    } else {
        // subtract
        return args.slice(1).reduce((prev, curr) => Number(prev) - Number(curr), Number(car));
    }
};
export const $$sub = $sub(null as any, null as any);


export const $mul = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (* number1 ... numberN)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) * Number(curr), Number(car));
};
export const $$mul = $mul(null as any, null as any);


export const $sup = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (** number1 ... numberN)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) ** Number(curr), Number(car));
};
export const $$sup = $sup(null as any, null as any);


export const $div = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (/ number1 ... numberN)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) / Number(curr), Number(car));
};
export const $$div = $div(null as any, null as any);


export const $mod = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (% number1 ... numberN)
    //  -> S expr  : number
    const car = $$first(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) % Number(curr), Number(car));
};
export const $$mod = $mod(null as any, null as any);


export const $max = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($max val1 ... valN)
    //  -> S expr  : value
    return Math.max(...args);
};
export const $$max = $max(null as any, null as any);


export const $min = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($min val1 ... valN)
    //  -> S expr  : value
    return Math.min(...args);
};
export const $$min = $min(null as any, null as any);


export const $avg = (state: SxParserState, name: string) => (...args: any[]) =>
    // S expression: ($avg val1 ... valN)
    //  -> S expr  : value
    args.length > 0 ? args.reduce((prev, curr) => Number(prev) + Number(curr), 0) / args.length : null;
export const $$avg = $avg(null as any, null as any);


export const $floor = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($floor number)
    //  -> S expr  : number
    return Math.floor(Number($$first(...args)));
};
export const $$floor = $floor(null as any, null as any);


export const $ceil = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($ceil number)
    //  -> S expr  : number
    return Math.ceil(Number($$first(...args)));
};
export const $$ceil = $ceil(null as any, null as any);


export const $round = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($round number)
    //  -> S expr  : number
    return Math.round(Number($$first(...args)));
};
export const $$round = $round(null as any, null as any);
