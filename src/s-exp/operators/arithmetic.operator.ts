// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../types';
import * as ops       from './arithmetic.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$bit-not',
    fn: ops.$bitNot,
}, {
    name: '$bit-and',
    fn: ops.$bitAnd,
}, {
    name: '$bit-or',
    fn: ops.$bitOr,
}, {
    name: '$bit-xor',
    fn: ops.$bitXor,
}, {
    name: '+',
    fn: ops.$add,
}, {
    name: '$add',
    fn: ops.$add,
}, {
    name: '$sum',
    fn: ops.$add,
}, {
    name: '-',
    fn: ops.$sub,
}, {
    name: '$sub',
    fn: ops.$sub,
}, {
    name: '$neg',
    fn: ops.$sub,
}, {
    name: '*',
    fn: ops.$mul,
}, {
    name: '$mul',
    fn: ops.$mul,
}, {
    name: '**',
    fn: ops.$sup,
}, {
    name: '$sup',
    fn: ops.$sup,
}, {
    name: '/',
    fn: ops.$div,
}, {
    name: '$div',
    fn: ops.$div,
}, {
    name: '%',
    fn: ops.$mod,
}, {
    name: '$mod',
    fn: ops.$mod,
}, {
    name: '$max',
    fn: ops.$max,
}, {
    name: '$min',
    fn: ops.$min,
}, {
    name: '$avg',
    fn: ops.$avg,
}, {
    name: '$floor',
    fn: ops.$floor,
}, {
    name: '$ceil',
    fn: ops.$ceil,
}, {
    name: '$round',
    fn: ops.$round,
}];


export default funcs;
