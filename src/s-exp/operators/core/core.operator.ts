// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo } from '../../types';
import * as ops       from './core.fn';



export const funcs: SxFuncInfo[] = [{
    name: '$car',
    fn: ops.$car,
}, {
    name: '$cdr',
    fn: ops.$cdr,
}, {
    name: '$cons',
    fn: ops.$cons,
}, {
    name: '$first',
    fn: ops.$first,
}, {
    name: '$second',
    fn: ops.$second,
}, {
    name: '$last',
    fn: ops.$last,
}, {
    name: '$progn', // alias of $last
    fn: ops.$last,
}, {
    name: '$rest',
    fn: ops.$rest,
}, {
    name: '$first-and-second',
    fn: ops.$firstAndSecond,
}, {
    name: '$atom',
    fn: ops.$atom,
}, {
    name: '$eq',
    fn: ops.$eq,
}, {
    name: '===',
    fn: ops.$eq,
}, {
    name: '$not-eq',
    fn: ops.$notEq,
}, {
    name: '!==',
    fn: ops.$notEq,
}, {
    name: '$list',
    fn: ops.$list,
}, {
    name: '$__scope',
    fn: ops.$__scope,
}, {
    name: '$__global',
    fn: ops.$__globalScope,
}, {
    name: '$__capture',
    fn: ops.$__capture,
}, {
    name: '$__lambda',
    fn: ops.$__lambda,
}, {
    name: '$$__lambda',
    fn: ops.$comp$__lambda,
}, {
    name: '$__defun',
    fn: ops.$__defun,
}, {
    name: '$$__defun',
    fn: ops.$comp$__defun,
}, {
    name: '$__refun',
    fn: ops.$__refun,
}, {
    name: '$__defmacro',
    fn: ops.$__defmacro,
}, {
    name: '$apply',
    fn: ops.$apply,
}, {
    name: '$__call',
    fn: ops.$__call,
}, {
    name: '$__try',
    fn: ops.$__try,
}, {
    name: '$raise',
    fn: ops.$raise,
}, {
    name: '$__if',
    fn: ops.$__if,
}, {
    name: '$__if-null',
    fn: ops.$__ifNull,
}, {
    name: '$__cond',
    fn: ops.$__cond,
}, {
    name: '$__while',
    fn: ops.$__while,
}, {
    name: '$__do-while',
    fn: ops.$__doWhile,
}, {
    name: '$__until',
    fn: ops.$__until,
}, {
    name: '$__do-until',
    fn: ops.$__doUntil,
}, {
    name: '$__repeat',
    fn: ops.$__repeat,
}, {
    name: '$__for',
    fn: ops.$__for,
}, {
    name: '$pipe',
    fn: ops.$pipe,
}, {
    name: '$__get',
    fn: ops.$__get,
}, {
    name: '$__let',
    fn: ops.$__let,
}, {
    name: '$__set',
    fn: ops.$__set,
}, {
    name: '$boolean',
    fn: ops.$boolean,
}, {
    name: '$not',
    fn: ops.$not,
}, {
    name: '$__and',
    fn: ops.$__and,
}, {
    name: '$__or',
    fn: ops.$__or,
}, {
    name: '==',
    fn: ops.$ambiguousEq,
}, {
    name: '!=',
    fn: ops.$ambiguousNotEq,
}, {
    name: '<',
    fn: ops.$lt,
}, {
    name: '<=',
    fn: ops.$le,
}, {
    name: '>',
    fn: ops.$gt,
}, {
    name: '>=',
    fn: ops.$ge,
}, {
    name: '$gensym',
    fn: ops.$gensym,
}, {
    name: '$is-symbol',
    fn: ops.$isSymbol,
}, {
    name: '$is-list',
    fn: ops.$isList,
}, {
    name: '$is-string',
    fn: ops.$isString,
}, {
    name: '$is-number',
    fn: ops.$isNumber,
}, {
    name: '$is-NaN',
    fn: ops.$isNaN,
}, {
    name: '$is-finite',
    fn: ops.$isFinite,
}, {
    name: '$is-integer',
    fn: ops.$isInteger,
}, {
    name: '$to-string',
    fn: ops.$toString,
}, {
    name: '$to-number',
    fn: ops.$toNumber,
}, {
    name: '$__#',
    fn: ops.$__toObject,
}, {
    name: '$object-assign',
    fn: ops.$objectAssign,
}, {
    name: '$json-stringify',
    fn: ops.$jsonStringify,
}, {
    name: '$now',
    fn: ops.$now,
}, {
    name: '$datetime-from-iso',
    fn: ops.$datetimeFromIso,
}, {
    name: '$datetime',
    fn: ops.$datetime,
}, {
    name: '$datetime-lc',
    fn: ops.$datetimeLc,
}, {
    name: '$datetime-to-iso-string',
    fn: ops.$datetimeToIsoString,
}, {
    name: '$datetime-to-components',
    fn: ops.$datetimeToComponents,
}, {
    name: '$datetime-to-components-lc',
    fn: ops.$datetimeToComponentsLc,
}, {
    name: '$json-parse',
    fn: ops.$jsonParse,
}, {
    name: '$match',
    fn: ops.$match,
}, {
    name: '$console-log',
    fn: ops.$consoleLog,
}, {
    name: '$console-error',
    fn: ops.$consoleError,
}, {
    name: '$console-trace',
    fn: ops.$consoleTrace,
}, {
    name: '$console-time',
    fn: ops.$consoleTime,
}, {
    name: '$console-time-end',
    fn: ops.$consoleTimeEnd,
}, {
    name: '$console-time-log',
    fn: ops.$consoleTimeLog,
}];


export default funcs;
