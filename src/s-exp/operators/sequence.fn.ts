// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState } from '../types';
import { $$first }       from './core.fn';



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
    args.slice(2).slice(Number(args[0]), Number(args[1]));
export const $$slice = $slice(null as any, null as any);
