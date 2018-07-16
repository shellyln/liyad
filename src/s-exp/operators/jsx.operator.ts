// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../types';
import * as ops       from './jsx.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$=__if',
    fn: ops.$__outputIf,
}, {
    name: '$=__for',
    fn: ops.$__outputForOf,
}];


export default funcs;
