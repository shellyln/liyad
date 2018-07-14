// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState } from '../types';
import { $$first,
         $$second }      from './core.fn';
import { $$add }         from './arithmetic.fn';



export const $length = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    return car.length();
};
export const $$length = $length(null as any, null as any);


export const $concat = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    return car.concat(...args.slice(1));
};
export const $$concat = $concat(null as any, null as any);


export const $slice = (state: SxParserState, name: string) => (...args: any[]) =>
    args[2].slice(Number(args[0]), Number(args[1]));
export const $$slice = $slice(null as any, null as any);


// tslint:disable-next-line:variable-name
export const $__at = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    const cdr = $$second(...args);
    return cdr[car];
};
// tslint:disable-next-line:variable-name
export const $$__at = $__at(null as any, null as any);


export const $reverse = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    return car.slice(0).reverse();
};
export const $$reverse = $reverse(null as any, null as any);


export const $filter = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    const cdr = $$second(...args);
    return car.filter(cdr);
};
export const $$filter = $filter(null as any, null as any);


export const $map = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    const cdr = $$second(...args);
    return car.map(cdr);
};
export const $$map = $map(null as any, null as any);


export const $reduce = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$first(...args);
    const cdr = $$second(...args);
    if (args.length < 3) {
        return car.reduce(cdr);
    } else {
        return car.reduce(cdr, args[2]);
    }
};
export const $$reduce = $reduce(null as any, null as any);


export const $max = (state: SxParserState, name: string) => (...args: any[]) =>
    Math.max(...args);
export const $$max = $max(null as any, null as any);


export const $min = (state: SxParserState, name: string) => (...args: any[]) =>
    Math.min(...args);
export const $$min = $min(null as any, null as any);


export const $avg = (state: SxParserState, name: string) => (...args: any[]) =>
    $$add(...args) / args.length;
export const $$avg = $avg(null as any, null as any);
