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

from NPM:
```bash
$ npm install liyad --save
```

or download UMD from [release](https://github.com/shellyln/liyad/releases) page.


## Install CLI

See [liyad-cli](https://github.com/shellyln/liyad-cli) .

```bash
$ npm install -g liyad-cli
$ liyad
```

## Playground

[https://shellyln.github.io/liyad/playground.html](https://shellyln.github.io/liyad/playground.html)

----


## Features

* APIs to customize all operators and macros
* Builtin S-expression parser
* Builtin minimal Lisp interpreter
* Reference implementation of LSX (alternative JSX notation using Lisp)

----

## Real world examples

* [Ménneu](https://www.npmjs.com/package/menneu)  
    Component-based extensible document processor
* [mdne - Markdown Neo Edit](https://www.npmjs.com/package/mdne)  
    A simple markdown and code editor powered by Markdown-it, Ace and Carlo.

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
                (option (@ (value $index)) ($concat "odd: " ($get $data "name"))) )
            ($=if (== (% $index 2) 0)
                (option (@ (value $index)) ($concat "even: " ($get $data "name"))) ))))`;
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
    JSON.stringify(S`
        ($list
            1 2 3 "a" "b" "C"
            ($list 4 5 6) ${"X"} ${["Y", "Z"]} )`

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
    JSON.stringify(lisp`
        ($defun fac (n)
            ($if (== n 0)
                1
                (* n ($self (- n 1))) ))
        ($list
            1 2 (fac 3) "a" "b" "c"
            ($list 4 5 (fac 6) ${"X"} ${["Y", "Z"]}) )`

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
                    (option (@ (value $index)) ($get $data "name")) )))`);
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
                (ExampleLoader  (@ (loadExample ${(i) => this.loadExample(i)}))) ))`);
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

    config.stripComments = true;

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


----

### Comments

```lisp
# This is a line comment

(# ; <-- This is a object literal, not a line comment
)

; This is a line comment

#|
This is a block comment
 |#
```

----

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


----


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


----


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


----


### Spread operator

```lisp
($list 1 2 ...($concat (3 4) (5 6)) 7 8)
```

is equivalent to:
```lisp
($list 1 2 ($spread ($concat (3 4) (5 6))) 7 8)
```

and is to be:
```json
[1,2,3,4,5,6,7,8]
```

`$spread` is NOT a macro. The list passed as a parameter is spliced ​​after evaluation.


----

### Splice macro

```lisp
($list 1 2 3 4 ($splice (5 6 7 8)) 9 10)
```

is equivalent to:
```lisp
($list 1 2 3 4 5 6 7 8 9 10)
```

```lisp
(($splice ($call x add)) 5 7)
```

is equivalent to:
```lisp
($call x add 5 7)
```

----

### Shorthands

#### $set

```lisp
(::foo:bar:baz= 7)
```

is equivalent to:
```lisp
($set ("foo" "bar" "baz") 7)
```

#### $get

```lisp
($list ::foo:bar:baz)
```

is equivalent to:
```lisp
($list ($get "foo" "bar" "baz"))
```

#### $call

```lisp
(::foo:bar@baz 3 5 7)
```

is equivalent to:
```lisp
($call ($get "foo" "bar") baz 3 5 7)
```

----


### Rest parameter

```lisp
($defun f (x ...y)
    ($list x y) )

($list
    (f 1)
    (f 1 2)
    (f 1 2 3)
    (f 1 2 3 4)
    (f 1 2 3 4 5) )
```

is to be:
```json
[
    [1,[]],
    [1,[2]],
    [1,[2,3]],
    [1,[2,3,4]],
    [1,[2,3,4,5]]
]
```

----

### Verbatim string literal

Verbatim string literal
```lisp
($last @"c:\documents\files\u0066.txt")
```

is to be:
```json
"c:\\documents\\files\\u0066.txt"
```

Normal string literal
```lisp
($last "c:\documents\files\u0066.txt")
```

is to be:
```json
"c:documents\filesf.txt"
```

----

### Object literal

```lisp
(# (foo "a")
   (bar 10)
   (baz) )
```

is to be:
```json
{
    "foo": "a",
    "bar": 10,
    "baz": true
}
```

----

### nil, null, undefined
```lisp
($list nil null undefined)
```

is to be:
```js
[[], null, undefined]
```

See [this](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/core/core.symbol.ts).

----

### Refer the function

```lisp
($defun fn(x) (+ x 1))
($let x (<- fn))
(x 3) ;; 4
```
> Liyad is `Lisp-2` language.

----

### Lambda and closure

Lambda
```lisp
($let fn (-> (x y z) (+ x y z)))

(fn 1 2 3) ;; 6
```
> `$lambda` is synonym of `->`.

Closure
```lisp
($let fn ($local ((a 1)(b 2)(c 3))
    (|-> (x y z) use (a b c)
        ($set a (+ a x))
        ($set b (+ b y))
        ($set c (+ c z))
        (+ a b c) )))

(fn 1 2 3) ;; 12
(fn 1 2 3) ;; 18
```
> `$closure` is synonym of `|->`.

is equivalent to:
```lisp
($let fn ($local ((a 1)(b 2)(c 3))
    ($capture (a b c) (-> (x y z)
        ($set a (+ a x))
        ($set b (+ b y))
        ($set c (+ c z))
        (+ a b c) ))))

(fn 1 2 3) ;; 12
(fn 1 2 3) ;; 18
```
> `$capture` can also be used with `$defun`.

----

### Recursive call

```lisp
($defun tarai(x y z)
    ($if (<= x y)
        y
        ($self ($self (- x 1) y z)
               ($self (- y 1) z x)
               ($self (- z 1) x y) )))
```
> `$self` refers to the function currently defined by `$defun` or `->`.

----

### Macro

```lisp
($defmacro FOR (!i <[> <FROM> s <TO> e <]> ...body)
    `($last
        ($local ((,i ,s))
            ($while (<= ,i ,e)
                ,@body
                ($set ,i (+ ,i 1)) ))))

($let c1   0)
($let c2 100)
(FOR p [ FROM (+ 1) TO (+ 6 -3) ]
    ($set c1 (+ c1 p))
    ($set c2 (+ c2 p)) )
```

#### Parameter type checking

|formal parameter  |constraint|
|------------------|----------|
|`!`_token_        |parameter should be symbol
|`<`_token_`>`     |parameter should be symbol named `token`
|_token_`:number`  |parameter should be number
|_token_`:string`  |parameter should be string
|_token_`:function`|parameter should be function
|_token_`:list`    |parameter should be list
|_token_`:symbol`  |parameter should be symbol

> Don't put spaces between `!` `<` `>` `:type` and _token_.

> Type checking checks formal parameter types before evaluation.

> Macro can be overloaded with the same macro name but different numbers of formal parameters.

----

### This object

```lisp
($let fn (-> () $this))
($let xx (# (a 3)
            (b 5)
            (f fn) ))
($json-stringify (::xx@f)) ;; {"a":3,"b":5}
```

----

### Compiling functions and lambdas (experimental)

|interpreting|compiling| |
|------------|---------|-|
|$defun      |$$defun  |define the function
|$lambda     |$$lambda |define the lambda
|->          |=>       |define the lambda
|$closure    |$$closure|define the closure
|\|->        |\|=>     |define the closure

----


## APIs

### `SExpression`

Create a new DSL.

```ts
interface SxParserConfig {
    raiseOnUnresolvedSymbol: boolean;
    enableEvaluate: boolean;
    enableHereDoc: boolean;
    enableSpread: boolean;
    enableSplice: boolean;
    enableShorthands: boolean;
    enableVerbatimStringLiteral: boolean;
    enableTailCallOptimization: boolean;
    enableRegExpMatchOperator: true, // IMPORTANT: Turn off to prevent ReDoS when executing untrusted code!
    stripComments: boolean;
    wrapExternalValue: boolean;
    reservedNames: SxReservedNames;
    returnMultipleRoot: boolean;
    maxEvalCount: number; // IMPORTANT: Set positive value to prevent DoS when executing untrusted code!

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

* returns : Template literal function.
* `config` : Parser config.

----


### `S`

Parse a S-expression.

```ts
function S(strings: TemplateStringsArray | string, ...values?: any[]): SxToken
```

* returns : S-expression parsing result as JSON object.
* `strings` : Template strings.
* `values` : values.

----


### `lisp`

Evaluate a Lisp code.

```ts
function lisp(strings: TemplateStringsArray | string, ...values?: any[]): SxToken
```

* returns : Evalueting result value of Lisp code.  
    * If input Lisp code has multiple top level parenthesis,  
      result value is last one.
* `strings` : Template strings.
* `values` : values.

----


### `lisp_async`

Evaluate a Lisp code.  
(asynchronous features are enabled.)

```ts
function lisp_async(strings: TemplateStringsArray | string, ...values?: any[]): Promise<SxToken>
```

* returns : Promise that evalueting result value of Lisp code.  
    * If input Lisp code has multiple top level parenthesis,  
      result value is last one.
* `strings` : Template strings.
* `values` : values.

----


### `LM`
Evaluate a Lisp code (returns multiple value).

```ts
function LM(strings: TemplateStringsArray | string, ...values?: any[]): SxToken
```

* returns : Evalueting result value of lisp code.  
    * If input Lisp code has multiple top level parenthesis,  
      result value is array.
* `strings` : Template strings.
* `values` : values.

----


### `LM_async`
Evaluate a Lisp code (returns multiple value).  
(asynchronous features are enabled.)

```ts
function LM_async(strings: TemplateStringsArray | string, ...values?: any[]): Promise<SxToken>
```

* returns : Promise that evalueting result value of lisp code.  
    * If input Lisp code has multiple top level parenthesis,  
      result value is array.
* `strings` : Template strings.
* `values` : values.

----


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

* returns : Template literal function.
* `lsxConf` : LSX config.

----


### `LSX_async`
Evaluate a Lisp code as LSX.  
(asynchronous features are enabled.)

```ts
interface LsxConfig {
    jsx: (comp: any, props: any, ...children: any[]) => any;
    jsxFlagment: any;
    components: object;
}

function LSX_async<R = SxToken>(lsxConf: LsxConfig): (strings: TemplateStringsArray, ...values: any[]) => Promise<R>
```

* returns : Template literal function.
* `lsxConf` : LSX config.


### (`lisp` | `lisp_async` | `LM` | `LM_async` : SExpressionTemplateFn) methods

#### evaluateAST

```ts
evaluateAST(ast: SxToken[]): SxToken;
```

* returns : evaluation result value.
* `ast` : AST to evaluate. it should be enclosed in `[]`.
    ```ts
    lisp.evaluateAST([[{symbol: '+'}, 1, 2 ,3]]);  // 6
    ```

#### repl

```ts
repl(): SExpressionTemplateFn;
```

* returns : Template literal function that will keep variables and states for each evaluation.

#### setGlobals

```ts
setGlobals(globals: object): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `globals` : Global variables to preset.

#### appendGlobals

```ts
appendGlobals(globals: object): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `globals` : Global variables to preset.

#### setStartup

```ts
setStartup(strings: TemplateStringsArray | string, ...values: any[]): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `strings` : Startup code that evaluate before each evaluation of user code.

#### setStartupAST

```ts
setStartupAST(ast: SxToken[]): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `ast` : Startup code AST that evaluate before each evaluation of user code.

#### appendStartup

```ts
appendStartup(strings: TemplateStringsArray | string, ...values: any[]): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `strings` : Startup code that evaluate before each evaluation of user code.

#### appendStartupAST

```ts
appendStartupAST(ast: SxToken[]): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `ast` : Startup code AST that evaluate before each evaluation of user code.

#### install

```ts
install(installer: (config: SxParserConfig) => SxParserConfig): SExpressionTemplateFn;
```

* returns : myself (template literal function).
* `installer` : Installer function that register the operators, macros, constants to the `config` object.


### `runScriptTags`
Run script tags.

```ts
function runScriptTags(
    lisp: SExpressionTemplateFn | SExpressionAsyncTemplateFn,
    globals?: object,
    contentType = 'text/lisp')
```

* returns : Evaluation result.
* `lisp` : Evaluater function.
* `globals` : Global variables.
* `contentType` : Content type attribute of script tags.

Usage:
```html
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <script type="text/lisp">
        ($local ((body (::document@querySelector "body")))
            ($set (body innerText) "Hello, Lisp! ") )
        ($local (c) ($capture (c)
            ($$defun tarai(x y z)
                ($set c (+ c 1))
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                        ($self (- y 1) z x)
                        ($self (- z 1) x y))))
            ($list ($datetime-to-iso-string ($now)) (tarai 13 6 0) c) ))
    </script>
    <script src="liyad.min.js"></script>
    <script>
        // Since the above lisp code refers to the body element,
        // you need to enclose the lisp evaluation with addEventListener.
        document.addEventListener('DOMContentLoaded', function(event) {
            const result = JSON.stringify(
                liyad.runScriptTags(liyad.lisp, {window, document}));
            const body = document.querySelector('body');
            setTimeout(() => body.innerText = body.innerText + result, 30);
        });
    </script>
</head>
<body></body>
```

----


## Operators

See
[core](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/core/index.ts),
[arithmetic](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/arithmetic/index.ts),
[sequence](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/sequence/index.ts),
[concurrent](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/concurrent/index.ts),
[JSX (LSX)](https://github.com/shellyln/liyad/blob/master/src/s-exp/operators/jsx/index.ts) operators.


----


## License
[ISC](https://github.com/shellyln/liyad/blob/master/LICENSE.md)  
Copyright (c) 2018, 2019 Shellyl_N and Authors.
