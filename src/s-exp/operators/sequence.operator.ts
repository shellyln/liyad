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
}, {
    name: '$__at',
    fn: ops.$__at,
}, {
    name: '$reverse',
    fn: ops.$reverse,
}, {
    name: '$filter',
    fn: ops.$filter,
}, {
    name: '$map',
    fn: ops.$map,
}, {
    name: '$reduce',
    fn: ops.$reduce,
}, {
    name: '$max',
    fn: ops.$max,
}, {
    name: '$min',
    fn: ops.$min,
}, {
    name: '$avg',
    fn: ops.$avg,
}];


export default funcs;
