// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


export * from './s-exp/s-expression';

export { default as installCore }         from './s-exp/operators/core';
export { default as coreOperators }       from './s-exp/operators/core/core.operator';
export { default as coreMacros }          from './s-exp/operators/core/core.macro';
export { default as coreSymbols }         from './s-exp/operators/core/core.symbol';

export { default as installArithmetic }   from './s-exp/operators/arithmetic';
export { default as arithmeticOperators } from './s-exp/operators/arithmetic/arithmetic.operator';
export { default as arithmeticMacros }    from './s-exp/operators/arithmetic/arithmetic.macro';
export { default as arithmeticSymbols }   from './s-exp/operators/arithmetic/arithmetic.symbol';

export { default as installSequence }     from './s-exp/operators/sequence';
export { default as sequenceOperators }   from './s-exp/operators/sequence/sequence.operator';
export { default as sequenceMacros }      from './s-exp/operators/sequence/sequence.macro';
export { default as sequenceSymbols }     from './s-exp/operators/sequence/sequence.symbol';

export { default as installJsx }          from './s-exp/operators/jsx';
export { default as jsxOperators }        from './s-exp/operators/jsx/jsx.operator';
export { default as jsxMacros }           from './s-exp/operators/jsx/jsx.macro';
export { default as jsxSymbols }          from './s-exp/operators/jsx/jsx.symbol';

export { default as installConcurrent }   from './s-exp/operators/concurrent';
export { default as concurrentOperators } from './s-exp/operators/concurrent/concurrent.operator';
export { default as concurrentMacros }    from './s-exp/operators/concurrent/concurrent.macro';
export { default as concurrentSymbols }   from './s-exp/operators/concurrent/concurrent.symbol';
