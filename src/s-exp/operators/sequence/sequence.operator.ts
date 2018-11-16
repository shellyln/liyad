// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../../types';
import * as ops       from './sequence.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$range',
    fn: ops.$range,
}, {
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
    name: '$replace-all',
    fn: ops.$replaceAll,
}, {
    name: '$split',
    fn: ops.$split,
}, {
    name: '$join',
    fn: ops.$join,
}, {
    name: '$concat',
    fn: ops.$concat,
}, {
    name: '$slice',
    fn: ops.$slice,
}, {
    name: '$top',
    fn: ops.$top,
}, {
    name: '$tail',
    fn: ops.$tail,
}, {
    name: '$push',
    fn: ops.$push,
}, {
    name: '$pop',
    fn: ops.$pop,
}, {
    name: '$__at',
    fn: ops.$__at,
}, {
    name: '$reverse',
    fn: ops.$reverse,
}, {
    name: '$reverse!',
    fn: ops.$reverseDestructive,
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
}, {
    name: '$sort!',
    fn: ops.$sortDestructive,
}, {
    name: '$group-every',
    fn: ops.$groupEvery,
}, {
    name: '$group-by',
    fn: ops.$groupBy,
}, {
    name: '$order-by',
    fn: ops.$orderBy,
}, {
    name: '$where',
    fn: ops.$where,
}];


export default funcs;
