// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState } from '../types';
import { $$first,
         $$second }      from './core.fn';
import { $$add }         from './arithmetic.fn';



export const $length = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($length listOrString)
    //  -> S expr  : number
    const car = $$first(...args);
    return car.length();
};
export const $$length = $length(null as any, null as any);


export const $trim = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($trim string)
    //  -> S expr  : string
    const car = $$first(...args);
    return car.trim();
};
export const $$trim = $trim(null as any, null as any);


export const $trimHead = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($trim-head string)
    //  -> S expr  : string
    const car = $$first(...args);
    return car.length();
};
export const $$trimHead = $trimHead(null as any, null as any);


export const $trimTail = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($trim-tail string)
    //  -> S expr  : string
    const car = $$first(...args);
    return car.length();
};
export const $$trimTail = $trimTail(null as any, null as any);


export const $concat = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($concat listOrString1 ... listOrStringN)
    //  -> S expr  : listOrString
    const car = $$first(...args);
    return car.concat(...args.slice(1));
};
export const $$concat = $concat(null as any, null as any);


export const $slice = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($slice start end listOrString)
    // S expression: ($slice start listOrString)
    //  -> S expr  : listOrString
    if (args.length === 3) {
        return args[2].slice(Number(args[0]), Number(args[1]));
    }
    if (args.length === 2) {
        return args[1].slice(Number(args[0]));
    }
    throw new Error(`[SX] $slice: Invalid argument length: expected: 2-3 / args: ${args.length}.`);
};
export const $$slice = $slice(null as any, null as any);


// tslint:disable-next-line:variable-name
export const $__at = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__at index listOrString)
    //  -> S expr  : any
    const car = $$first(...args);
    const cdr = $$second(...args);
    return cdr[car];
};
// tslint:disable-next-line:variable-name
export const $$__at = $__at(null as any, null as any);


export const $reverse = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reverse listOrString)
    //  -> S expr  : listOrString
    const car = $$first(...args);
    return car.slice(0).reverse();
};
export const $$reverse = $reverse(null as any, null as any);


export const $find = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($map list (lambda (v index array) (... boolean)))
    //  -> S expr  : list
    const car = $$first(...args);
    const cdr = $$second(...args);
    return car.map(cdr);
};
export const $$find = $find(null as any, null as any);


export const $filter = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($filter list (lambda (v index array) (... boolean)))
    //  -> S expr  : list
    const car = $$first(...args);
    const cdr = $$second(...args);
    return car.filter(cdr);
};
export const $$filter = $filter(null as any, null as any);


export const $map = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($map list (lambda (v index array) (... any)))
    //  -> S expr  : list
    const car = $$first(...args);
    const cdr = $$second(...args);
    return car.map(cdr);
};
export const $$map = $map(null as any, null as any);


export const $reduce = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reduce list (lambda (acc v index array) (... any)) initial-value)
    // S expression: ($reduce list (lambda (acc v index array) (... any)))
    //  -> S expr  : list
    const car = $$first(...args);
    const cdr = $$second(...args);
    if (args.length < 3) {
        return car.reduce(cdr);
    } else {
        return car.reduce(cdr, args[2]);
    }
};
export const $$reduce = $reduce(null as any, null as any);


export const $reduceFromTail = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reduce list (lambda (acc v index array) (... any)) initial-value)
    // S expression: ($reduce list (lambda (acc v index array) (... any)))
    //  -> S expr  : list
    const car = $$first(...args);
    const cdr = $$second(...args);
    if (args.length < 3) {
        return car.reduceRight(cdr);
    } else {
        return car.reduceRight(cdr, args[2]);
    }
};
export const $$reduceFromTail = $reduceFromTail(null as any, null as any);


export const $sort = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($reduce list (lambda (a b) (... number_a-b)))
    //  -> S expr  : list
    const car = $$first(...args);
    const cdr = $$second(...args);
    return car.sort(cdr);
};
export const $$sort = $sort(null as any, null as any);
