# Liyad
## Let's make your yet another DSL with Lisp S-expression!

[![Liyad](https://shellyln.github.io/assets/image/liyad-logo.svg)](https://shellyln.github.io/liyad/)

Liyad (Lisp yet another DSL interpreter, or LIYAD is yum and delicious) is
very small Lisp interpreter written in JavaScript.  
You can easily start making your new DSL using Lisp and S-expression.


[![npm](https://img.shields.io/npm/v/liyad.svg)](https://www.npmjs.com/package/liyad)
[![GitHub release](https://img.shields.io/github/release/shellyln/liyad.svg)](https://github.com/shellyln/liyad/releases)
[![Travis](https://img.shields.io/travis/shellyln/liyad/master.svg)](https://travis-ci.org/shellyln/liyad)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/liyad.svg?style=social&label=Fork)](https://github.com/shellyln/liyad/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/liyad.svg?style=social&label=Star)](https://github.com/shellyln/liyad)



## Install

```bash
$ npm install liyad --save
```

## Playground

https://shellyln.github.io/liyad/playground.html

----


## Features

* APIs to customize all operators and macros
* Builtin S-expression parser
* Builtin minimal Lisp interpreter
* Reference implementation of LSX (alternative JSX notation using Lisp)


----


## What is LSX

LSX is an alternative JSX notation using Lisp.

### LSX and Liyad advantages:
* No transpiler needed
  + Liyad uses ES6 template literal syntax.   
    You don't pass the entire code to transpile and evaluate it.  
    Save your coding times.

* Secure execution for untrusted contents
  + No host environment's symbols are accessible from evaluated user contents by default.  
    Malicious codes can not make a serious attack.

* Simple and powerful
  + What you can do with JSX can be done with LSX.  
    Plus, LSX itself is a complete data description format
    and is a complete programming language,  
    so you can write more concise and powerful.


The LSX runtime directly calls `React.createElement`
(or a [JSX Factory](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/) function such as
[RedAgate](https://github.com/shellyln/red-agate/tree/master/packages/red-agate#configurations-for-building-application),
[Vue.js](https://vuejs.org/v2/guide/render-function.html#JSX), etc.) as a Lisp function,  
Convert a Lisp list to a renderer component object tree.

In order to resolve the renderer component, you must register the object's constructor with the LSX runtime in advance.

All unresolved lisp function symbols are dispatched to `React.createElement('some_unresolved_name', ...)`.  
You can declare HTML/XML standard tags.

As with JSX, LSX must always return a single component.  
Using `Template` Lisp function instead of JSX `Fragment` tag will produce the same result.


### Example:

```ts
lsx`
(Template
    (select (@ (style (display "inline-block")
                      (width "300px") )
               (className "foo bar baz")
               (onChange ${(e) => this.handleExampleSelected(e.target.value)}) )
        ($=for ${exampleCodes}
            ($=if (== (% $index 2) 1)
                (option (@ (value $index)) ($concat "odd: " ($get $data "name")) )
            )
            ($=if (== (% $index 2) 0)
                (option (@ (value $index)) ($concat "even: " ($get $data "name")) )
            )
        )
    )
)`;
```

### See also:
[Playground](https://shellyln.github.io/liyad/playground.html)'s
[source code](https://github.com/shellyln/liyad/blob/master/src.dist/assets/script/playground.js)
is written in LSX.

----


## Usage

### Output S-expression into JSON:
```ts
import { S } from 'liyad';

console.log(
    JSON.stringify( S`
        ($list
            1 2 3 "a" "b" "C"
            ($list 4 5 6) ${"X"} ${["Y", "Z"]}
        )`

        // You can also parse by calling w/o template literal syntax as following:
        // S(' ... ')
    )
);
```

Output:
```json
[{"symbol":"$list"},1,2,3,"a","b","C",[{"symbol":"$list"},4,5,6],{"value":"X"},{"value":["Y","Z"]}]
```



### Run minimal Lisp interpreter:
```ts
import { lisp } from 'liyad';

console.log(
    JSON.stringify( lisp`
        ($defun fac (n)
            ($if (== n 0)
                1
                (* n ($self (- n 1))) ))
        ($list
            1 2 (fac 3) "a" "b" "c"
            ($list 4 5 (fac 6) ${"X"} ${["Y", "Z"]})
        )`

        // You can also evaluate by calling w/o template literal syntax as following:
        // lisp(' ... ')
    )
);
```

Output:
```json
[1,2,6,"a","b","c",[4,5,720,"X",["Y","Z"]]]
```



### Render web page with LSX:
```ts
import * as React    from 'react';
import * as ReactDOM from 'react-dom';
import { LSX }       from 'liyad';

var lsx = null;

const exampleCodes = [{
    name: "Example1: factorial",
    code: ` ... `
}, {
    name: "Example2: Hello, World!",
    code: ` ... `,
}];

class ExampleLoader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    handleExampleSelected(i) {
        this.props.loadExample(i);
    }

    render() {
        return (lsx`
        (Template
            (select (@ (style (display "inline-block")
                              (width "300px") )
                       (onChange ${(e) => this.handleExampleSelected(e.target.value)}) )
                ($=for ${exampleCodes}
                    (option (@ (value $index)) ($get $data "name") )
                )
            )
        )`);
    }
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    loadExample(i) {
        console.log(exampleCodes[i].code);
    }

    render() {
        return (lsx`
        (Template
            (div (@ (style (margin "4px")))
                (ExampleLoader  (@ (loadExample ${(i) => this.loadExample(i)}) ))
            )
        )`);
    }
}

var lsx = LSX({
    jsx: React.createElement,
    jsxFlagment: React.Fragment,
    components: {
        ExampleLoader,
        App,
    },
});

ReactDOM.render(lsx`(App)`, document.getElementById('app'));
```


### Build your new DSL:
```ts
import { SxFuncInfo,
         SxMacroInfo,
         SxSymbolInfo,
         SExpression,
         SxParserConfig,
         defaultConfig,
         installCore,
         installArithmetic,
         installSequence } from 'liyad';

const myOperators: SxFuncInfo[] = [{
    name: '$__defun',
    fn: (state: SxParserState, name: string) => (...args: any[]) => {
        // S expression: ($__defun 'name '(sym1 ... symN) 'expr ... 'expr)
        //  -> S expr  : fn
        const car: SxSymbol = $$first(...args);
        if (args.length < 3) {
            throw new Error(`[SX] $__defun: Invalid argument length: expected: ${3} / args: ${args.length}.`);
        }
        const fn = $__lambda(state, name)(...args.slice(1));
        state.funcMap.set(car.symbol, {
            name: car.symbol,
            fn: (st, nm) => fn
        });
        return fn;
    },
}];

const myMacros: SxMacroInfo[] = [{
    name: '$defun',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($defun name (sym1 ... symN) expr ... expr)
        //  -> S expr  : ($__defun 'name '(sym1 ... symN) 'expr ... 'expr)
        return [{symbol: '$__defun'},
            ...(list.slice(1).map(x => quote(state, x))),
        ];
    },
}];

const mySymbols: SxSymbolInfo[] = [
    {name: '#t', fn: (state: SxParserState, name: string) => true}
];

export const MyDSL = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.funcs = (config.funcs || []).concat(myOperators);
    config.macros = (config.macros || []).concat(myMacros);
    config.symbols = (config.symbols || []).concat(mySymbols);

    return SExpression(config);
})();


console.log(
    JSON.stringify(MyDSL`( ... )`)
);
```


----


## Extended syntax

<hr style="width: 50%; border-style: dashed; margin-left: 0;" />

### Here document:

```lisp
"""
Hello, Liyad!
"""
```

is equivalent to:
```lisp
(Template
"
Hello, Liyad!
"
)
```


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### Here document with variable substitution:

```lisp
"""
Hello, %%%($get name)!
"""
```

is equivalent to:
```lisp
(Template
"
Hello, " ($get name) "!
"
)
```


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### Here document with custom function:

```lisp
"""div
Hello, %%%($get name)!
"""
```

is equivalent to:
```lisp
(div
"
Hello, " ($get name) "!
"
)
```


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### Here document with custom function and LSX props:

```lisp
"""div@{(id "123") (class "foo bar baz")}
Hello, %%%($get name)!
"""
```

is equivalent to:
```lisp
(div (@ (id "123") (class "foo bar baz"))
"
Hello, " ($get name) "!
"
)
```


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### Spread operator

```lisp
```


----


## APIs

<hr style="width: 50%; border-style: dashed; margin-left: 0;" />

### `SExpression`

Create a new DSL.

```ts
interface SxParserConfig {
    raiseOnUnresolvedSymbol: boolean;
    enableEvaluate: boolean;
    enableHereDoc: boolean;
    enableTailCallOptimization: boolean;
    stripComments: boolean;
    strippedCommentValue: any;
    wrapExternalValue: boolean;
    reservedNames: SxReservedNames;
    returnMultipleRoot: boolean;

    jsx?: (comp: any, props: any, ...children: any[]) => any;
    JsxFragment?: any;

    funcs: SxFuncInfo[];
    macros: SxMacroInfo[];
    symbols: SxSymbolInfo[];

    funcSymbolResolverFallback?: SxFunc;
    valueSymbolResolverFallback?: SxSymbolResolver;
}

function SExpression(config: SxParserConfig): (strings: TemplateStringsArray | string, ...values?: any[]) => SxToken
```

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `returns` :
> Template literal function.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `config` :
> Parser config.


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### `S`
Parse a S-expression.

```ts
function S(strings: TemplateStringsArray | string, ...values?: any[]): SxToken
```

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `returns` :
> S-expression parsing result as JSON object.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `strings` :
> Template strings.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `values` :
> values.


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### `lisp`
Evaluate a Lisp code.

```ts
function lisp(strings: TemplateStringsArray | string, ...values?: any[]): SxToken
```

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `returns` :
> Evalueting result value of Lisp code.  
> If input Lisp code has multiple top level parenthesis,
> result value is last one.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `strings` :
> Template strings.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `values` :
> values.


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### `LM`
Evaluate a Lisp code (returns multiple value).

```ts
function LM(strings: TemplateStringsArray | string, ...values?: any[]): SxToken
```

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `returns` :
> Evalueting result value of lisp code.  
> If input Lisp code has multiple top level parenthesis,
> result value is array.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `strings` :
> Template strings.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `values` :
> values.


<hr style="width: 50%; border-style: dashed; margin-left: 0;" />


### `LSX`
Evaluate a Lisp code as LSX.

```ts
interface LsxConfig {
    jsx: (comp: any, props: any, ...children: any[]) => any;
    jsxFlagment: any;
    components: object;
}

function LSX<R = SxToken>(lsxConf: LsxConfig): (strings: TemplateStringsArray, ...values: any[]) => R
```

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `returns` :
> Template literal function.

<hr style="width: 30%; border-style: dotted; margin-left: 0;" />

#### `lsxConf` :
> LSX config.



----


## Operators

See
[core](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/core.ts),
[arithmetic](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/arithmetic.ts),
[sequence](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/sequence.ts),
[JSX (LSX)](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/jsx.ts) operators.


----


## License
[ISC](https://github.com/shellyln/liyad/blob/master/LICENSE.md)  
Copyright (c) 2018, Shellyl_N and Authors.
