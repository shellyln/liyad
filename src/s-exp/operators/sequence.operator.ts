// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../types';
import * as ops       from './sequence.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$length',
    fn: ops.$length,
}, {
    name: '$trim',
    fn: ops.$trim,
}, {
    name: '$trim-head',
    fn: ops.$trimHead,
}, {
    name: '$trim-tail',
    fn: ops.$trimTail,
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
    name: '$find',
    fn: ops.$find,
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
    name: '$reduce-from-head',
    fn: ops.$reduce,
}, {
    name: '$reduce-from-tail',
    fn: ops.$reduceFromTail,
}, {
    name: '$sort',
    fn: ops.$sort,
}];


export default funcs;
