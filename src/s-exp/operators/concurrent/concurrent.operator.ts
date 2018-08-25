// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../../types';
import * as ops       from './concurrent.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$__let-async',
    fn: ops.$__letAsync,
}, {
    name: '$__set-async',
    fn: ops.$__setAsync,
}, {
    name: '$then',
    fn: ops.$then,
}, {
    name: '$resolve-all',
    fn: ops.$resolveAll,
}, {
    name: '$resolve-any',
    fn: ops.$resolveAny,
}, {
    name: '$resolve-pipe',
    fn: ops.$resolvePipe,
}, {
    name: '$resolve-fork',
    fn: ops.$resolveFork,
}];


export default funcs;
