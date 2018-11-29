// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


export * from './s-exp/s-expression';
export * from './s-exp/browser';


export { default as installCore }         from './s-exp/operators/core';
export { default as installArithmetic }   from './s-exp/operators/arithmetic';
export { default as installSequence }     from './s-exp/operators/sequence';
export { default as installJsx }          from './s-exp/operators/jsx';
export { default as installConcurrent }   from './s-exp/operators/concurrent';


import { default as coreOperators }       from './s-exp/operators/core/core.operator';
import { default as coreMacros }          from './s-exp/operators/core/core.macro';
import { default as coreSymbols }         from './s-exp/operators/core/core.symbol';

import { default as arithmeticOperators } from './s-exp/operators/arithmetic/arithmetic.operator';
import { default as arithmeticMacros }    from './s-exp/operators/arithmetic/arithmetic.macro';
import { default as arithmeticSymbols }   from './s-exp/operators/arithmetic/arithmetic.symbol';

import { default as sequenceOperators }   from './s-exp/operators/sequence/sequence.operator';
import { default as sequenceMacros }      from './s-exp/operators/sequence/sequence.macro';
import { default as sequenceSymbols }     from './s-exp/operators/sequence/sequence.symbol';

import { default as jsxOperators }        from './s-exp/operators/jsx/jsx.operator';
import { default as jsxMacros }           from './s-exp/operators/jsx/jsx.macro';
import { default as jsxSymbols }          from './s-exp/operators/jsx/jsx.symbol';

import { default as concurrentOperators } from './s-exp/operators/concurrent/concurrent.operator';
import { default as concurrentMacros }    from './s-exp/operators/concurrent/concurrent.macro';
import { default as concurrentSymbols }   from './s-exp/operators/concurrent/concurrent.symbol';


export const builtinOperators = {
    core: coreOperators,
    arithmetic: arithmeticOperators,
    sequence: sequenceOperators,
    jsx: jsxOperators,
    concurrent: concurrentOperators,
};

export const builtinMacros = {
    core: coreMacros,
    arithmetic: arithmeticMacros,
    sequence: sequenceMacros,
    jsx: jsxMacros,
    concurrent: concurrentMacros,
};

export const builtinSymbols = {
    core: coreSymbols,
    arithmetic: arithmeticSymbols,
    sequence: sequenceSymbols,
    jsx: jsxSymbols,
    concurrent: concurrentSymbols,
};
