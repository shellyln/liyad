// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../types';
import * as ops       from './sequence.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$length',
    fn: ops.$length,
}, {
    name: '$concat',
    fn: ops.$concat,
}, {
    name: '$slice',
    fn: ops.$slice,
}];


export default funcs;
