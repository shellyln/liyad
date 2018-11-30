// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxSymbol,
         SxToken,
         CompilerContext }            from '../types';
import { isSymbol }                   from '../ast';
import { checkParamsLength }          from '../errors';
import { stripQuote,
         stripQuoteOrPass,
         getScope_stateApplied,
         resolveValueSymbol_dynamic } from './helpers';



export function registerOperators(state: SxParserState, ctx: CompilerContext) {
    const {
        _$_vars,
        ops,
        makeScope,
        compileToken,
    } = ctx;


    ops.set('$quote', function(r: SxToken[], args: SxToken[]) {
        let compFnBody = '';
        _$_vars[ctx.varsCount] = r[1];
        compFnBody += `(_$_vars[${String(ctx.varsCount++)}])`;
        return compFnBody;
    });


    ops.set('$self', function(r: SxToken[], args: SxToken[]) {
        let compFnBody = '';
        compFnBody += `((_$_vars[0])(${
            args.map(x => compileToken([stripQuoteOrPass(state, x)], 0)).join(',')}))`;
        return compFnBody;
    });


    ops.set('$__if', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__if condition 't-expr 'f-expr)
        //  -> (if condition is true ) S expr  : t-expr
        //  -> (if condition is false) S expr  : f-expr
        let compFnBody = '';
        checkParamsLength('compileToken:$__if', args, 2, 3);
        compFnBody += `(${compileToken(r, 1)}?(${
            compileToken([stripQuote(state, r[2])], 0)}):(${
            compileToken([stripQuote(state, r[3])], 0)}))`;
        return compFnBody;
    });


    ops.set('$__if-null', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__if-null condition 'null-expr)
        //  -> (if condition is not null ) S expr  : condition
        //  -> (if condition is null)      S expr  : null-expr
        let compFnBody = '';
        checkParamsLength('compileToken:$__if-null', args, 2, 2);
        compFnBody += `((()=>{let _$_rv=${compileToken(r, 1)};return _$_rv?_$_rv:(${
            compileToken([stripQuote(state, r[2])], 0)}});})())`;
        return compFnBody;
    });


    ops.set('$__cond', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__cond 'cond1 'expr1 ... 'condN 'exprN)
        //  -> (if (eval condI) is true ) S expr  : exprI
        //  -> (if no matched)            S expr  : null
        let compFnBody = '';
        {
            checkParamsLength('compileToken:$__cond', args, 1);
            compFnBody += `(`;
            for (let p = 0; p < args.length; p += 2) {
                compFnBody += `${compileToken([stripQuote(state, args[p])], 0)}?(${
                    compileToken([stripQuote(state, args[p + 1])], 0)}):(`;
            }
            compFnBody += `null`;
            for (let p = 0; p < args.length; p += 2) {
                compFnBody += `)`;
            }
            compFnBody += `)`;
        }
        return compFnBody;
    });


    ops.set('$__while', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__while 'condition 'expr1 ... 'exprN)
        //  -> (if condition is true at least 1 or more times) S expr  : exprN
        //  -> (else)                                          S expr  : null
        let compFnBody = '';
        checkParamsLength('compileToken:$__while', args, 1);
        compFnBody += `((()=>{let _$_rv=null;while(${
            compileToken([stripQuote(state, r[1])], 0)}){_$_rv=${
            r.slice(2).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')
            }}return _$_rv})())`;
        return compFnBody;
    });


    ops.set('$__do-while', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__do-while 'condition 'expr1 ... 'exprN)
        //  -> (if condition is true at least 1 or more times) S expr  : exprN
        //  -> (else)                                          S expr  : null
        let compFnBody = '';
        checkParamsLength('compileToken:$__do-until', args, 1);
        compFnBody += `((()=>{let _$_rv=null;do{_$_rv=${
            r.slice(2).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')}}}while(${
            compileToken([stripQuote(state, r[1])], 0)})return _$_rv)())`;
        return compFnBody;
    });


    ops.set('$__until', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__until 'condition 'expr1 ... 'exprN)
        //  -> (if condition is true at least 1 or more times) S expr  : exprN
        //  -> (else)                                          S expr  : null
        let compFnBody = '';
        checkParamsLength('compileToken:$__until', args, 1);
        compFnBody += `((()=>{let _$_rv=null;while(!${
            compileToken([stripQuote(state, r[1])], 0)}){_$_rv=${
            r.slice(2).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')
            }}return _$_rv})())`;
        return compFnBody;
    });


    ops.set('$__do-until', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__do-until 'condition 'expr1 ... 'exprN)
        //  -> (if condition is true at least 1 or more times) S expr  : exprN
        //  -> (else)                                          S expr  : null
        let compFnBody = '';
        checkParamsLength('compileToken:$__do-until', args, 1);
        compFnBody += `((()=>{let _$_rv=null;do{_$_rv=${
            r.slice(2).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')}}}while(!${
            compileToken([stripQuote(state, r[1])], 0)})return _$_rv)())`;
        return compFnBody;
    });


    ops.set('$__repeat', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__repeat 'i n-times 'expr1 ... 'exprN)
        //  -> (if n > 0) S expr  : exprN
        //  -> (else)     S expr  : null
        let compFnBody = '';
        checkParamsLength('compileToken:$__repeat', args, 2);
        if (! isSymbol(args[0])) {
            throw new Error(`[SX] compileToken: $__repeat : args[0] is not symbol.`);
        }
        makeScope(() => {
            const name = 'v' + ctx.varNamesCount++;
            ctx.varNames.set((args[0] as SxSymbol).symbol, name);
            compFnBody += `(((_$_n)=>{let _$_rv=null;for(let ${name}=0;${name}<_$_n;${name}++){_$_rv=${
                r.slice(2).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')
                }}return _$_rv})(${compileToken(args, 1)}))`;
        });
        return compFnBody;
    });


    ops.set('$__for', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__for 'x list 'expr1 ... 'exprN)
        //  -> (if list.length > 0) S expr  : exprN
        //  -> (else)               S expr  : null
        let compFnBody = '';
        checkParamsLength('compileToken:$__for', args, 2);
        if (! isSymbol(args[0])) {
            throw new Error(`[SX] compileToken: $__for : args[0] is not symbol.`);
        }
        makeScope(() => {
            const name = 'v' + ctx.varNamesCount++;
            ctx.varNames.set((args[0] as SxSymbol).symbol, name);
            compFnBody += `(((_$_l)=>{let _$_rv=null;for(const ${name} of _$_l){_$_rv=${
                r.slice(2).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')
                }}return _$_rv})(${compileToken(args, 1)}))`;
        });
        return compFnBody;
    });


    ops.set('$__scope', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__scope isBlockLocal returnMultiple '((name value) | name ...) 'expr1 ... 'exprN)
        //  -> (if returnMultiple)  S expr  : [expr1 ... exprN]
        //  -> (else)               S expr  : exprN
        let compFnBody = '';
        checkParamsLength('compileToken:$__scope', args, 2);
        // r[1]: isBlockLocal
        // r[2]: returnMultiple
        if (! Array.isArray(r[3])) {
            throw new Error(`[SX] compileToken: $__scope : args[2] is not array.`);
        }
        makeScope(() => {
            for (const x of stripQuote(state, r[3]) as any[]) {
                let name = '';
                if (Array.isArray(x)) {
                    if (x.length < 1) {
                        throw new Error(`[SX] compileToken: $__scope : args[0][?] is too short.`);
                    }
                    if (! isSymbol(x[0])) {
                        throw new Error(`[SX] compileToken: $__scope : args[0][?][0] is not symbol.`);
                    }
                    name = x[0].symbol;
                    compFnBody += `(${'v' + ctx.varNamesCount}=${compileToken(x, 1)})`;
                } else {
                    if (! isSymbol(x)) {
                        throw new Error(`[SX] compileToken: $__scope : args[0][?] is not symbol.`);
                    }
                    name = x.symbol;
                }
                ctx.varDefs += `var v${ctx.varNamesCount}=void 0;`;
                ctx.varNames.set(x.symbol, 'v' + ctx.varNamesCount++);
            }
            const s = `${r.slice(4).map((x) => compileToken([stripQuote(state, x)], 0)).join(',')}`;
            compFnBody += r[2] ? `[${s}]` : `(${s})`;
        });
        return compFnBody;
    });


    ops.set('$__try', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__try 'expr 'catch-expr)
        //  ->                               S expr  : expr
        //  -> (if error is raised in expr)  S expr  : catch-expr
        let compFnBody = '';
        checkParamsLength('compileToken:$__try', args, 1, 2);
        compFnBody += `((()=>{try{${
            compileToken([stripQuote(state, r[1])], 0)}}catch(e${
            ctx.varNamesCount}){let e${ctx.varNamesCount + 1}=(_$_vars[${String(ctx.varsCount)}])();`;
        _$_vars[ctx.varsCount++] = getScope_stateApplied(state);
        makeScope(() => {
            ctx.varNames.set('$error', 'e' + ctx.varNamesCount++);
            ctx.varNames.set('$parent', 'e' + ctx.varNamesCount++);
            compFnBody += `${
                compileToken([stripQuote(state, r[2])], 0)}}})())`;
        });
        return compFnBody;
    });


    ops.set('$raise', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($raise 'expr)
        //  -> S expr  : -
        let compFnBody = '';
        compFnBody += `((()=>{throw ${
            compileToken([stripQuoteOrPass(state, r[1])], 0)}})())`;
        return compFnBody;
    });


    ops.set('$boolean', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($boolean any)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:$boolean', args, 1, 1);
        compFnBody += `((x0=${compileToken(args, 0)
            }),(Array.isArray(x0)&&x0.length===0?false:boolean(x0)))`;
        return compFnBody;
    });


    ops.set('$__get', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__get 'nameOrIndex1 ... 'nameOrIndexN)
        //  -> S expr  : any
        let compFnBody = '';
        checkParamsLength('compileToken:$__get', args, 1);
        const quoted = stripQuote(state, r[1]);
        const name = isSymbol(quoted) ? quoted.symbol : (typeof quoted === 'string' ? quoted : null);
        if (typeof name !== 'string') {
            throw new Error(`[SX] compileToken: $__get : operand is not symbol: ${JSON.stringify(r[1])}.`);
        }
        let vName = '';
        if (ctx.varNames.has(name)) {
            vName = ctx.varNames.get(name) as string;
        } else {
            _$_vars[ctx.varsCount] = resolveValueSymbol_dynamic(state, name);
            vName = `_$_vars[${String(ctx.varsCount++)}]`;
        }
        const regToVars = (symName: string) => {
            _$_vars[ctx.varsCount] = symName;
            return `_$_vars[${String(ctx.varsCount++)}]`;
        };
        compFnBody += `((${vName})${r.slice(2).map((x, idx, arr) => `[${
            isSymbol(arr[idx]) ?
                regToVars((arr as any)[idx].symbol) :
                compileToken(arr, idx)}]`).join('')})`;
        return compFnBody;
    });


    ops.set('$__let', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__let 'nameStrOrSymbol expr)
        //  -> S expr  : any
        let compFnBody = '';
        checkParamsLength('compileToken:$__let', args, 1, 1);
        const quoted = stripQuote(state, r[1]);
        const name = isSymbol(quoted) ? quoted.symbol : (typeof quoted === 'string' ? quoted : null);
        if (typeof name !== 'string') {
            throw new Error(`[SX] compileToken: $__let : operand is not rvalue: ${JSON.stringify(r[1])}.`);
        }
        if (! ctx.varNames.has(name)) {
            ctx.varDefs += `var v${ctx.varNamesCount}=void 0;`;
            ctx.varNames.set(name, 'v' + ctx.varNamesCount++);
        }
        compFnBody += `(${ctx.varNames.get(name)}=${compileToken(r, 2)})`;
        return compFnBody;
    });


    ops.set('$__set', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__set 'nameOrListOfNameOrIndex expr)
        //  -> S expr  : any
        let compFnBody = '';
        checkParamsLength('compileToken:$__set', args, 2, 2);
        const quoted = stripQuote(state, r[1]);
        const name = isSymbol(quoted) ?
            quoted.symbol :
            (typeof quoted === 'string' ?
                quoted :
                (Array.isArray(quoted) ?
                    (isSymbol(quoted[0]) ?
                        quoted[0].symbol :
                        (typeof quoted[0] === 'string' ? quoted[0] : null)
                    ) :
                    null
                )
            );
        if (typeof name !== 'string') {
            throw new Error(`[SX] compileToken: $__set : operand is not rvalue: ${JSON.stringify(r[1])}.`);
        }
        let vName = '';
        if (ctx.varNames.has(name)) {
            vName = ctx.varNames.get(name) as string;
        } else {
            _$_vars[ctx.varsCount] = resolveValueSymbol_dynamic(state, name);
            vName = `_$_vars[${String(ctx.varsCount++)}]`;
        }
        const regToVars = (symName: string) => {
            _$_vars[ctx.varsCount] = symName;
            return `_$_vars[${String(ctx.varsCount++)}]`;
        };
        compFnBody += `((${vName})${(Array.isArray(quoted) ? quoted.slice(1) : []).map((x, idx, arr) => `[${
            isSymbol(arr[idx]) ?
                regToVars((arr as any)[idx].symbol) :
                compileToken(arr, idx)}]`).join('')}=${compileToken(r, 2)})`;
        return compFnBody;
    });


    ops.set('$not', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($not any)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:$not', args, 1, 1);
        compFnBody += `(!${compileToken(args, 0)})`;
        return compFnBody;
    });


    ops.set('$__and', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__and 'expr1 ... 'exprN)
        //  -> (if all of ($boolean expr1) ... ($boolean exprN) are true) S expr  : exprN
        //  -> (else)                                                     S expr  : expr-i (false left most)
        let compFnBody = '';
        checkParamsLength('compileToken:$__and', args, 1);
        compFnBody += `(${args.map((x) => compileToken([stripQuote(state, x)], 0)).join('&&')})`;
        return compFnBody;
    });


    ops.set('$__or', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($__or 'expr1 ... 'exprN)
        //  -> (if any ($boolean expr1) ... ($boolean exprN) are true) S expr  : expr-i (where i: index of item first ($boolean expr-i) is to be true)
        //  -> (else)                                                  S expr  : expr-i (false right most)
        let compFnBody = '';
        checkParamsLength('compileToken:$__or', args, 1);
        compFnBody += `(${args.map((x) => compileToken([stripQuote(state, x)], 0)).join('||')})`;
        return compFnBody;
    });


    ops.set('===', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($eq arg1 arg2)
        //  -> (if arg1 === arg2)  S expr  : true
        //  -> (else)              S expr  : false
        let compFnBody = '';
        checkParamsLength('compileToken:===', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('===')})`;
        return compFnBody;
    });


    ops.set('!==', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($not-eq arg1 arg2)
        //  -> (if arg1 !== arg2)  S expr  : true
        //  -> (else)              S expr  : false
        let compFnBody = '';
        checkParamsLength('compileToken:!==', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('!==')})`;
        return compFnBody;
    });


    ops.set('==', function(r: SxToken[], args: SxToken[]) {
        // S expression: (== a b)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:==', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('==')})`;
        return compFnBody;
    });


    ops.set('!=', function(r: SxToken[], args: SxToken[]) {
        // S expression: (!= a b)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:!=', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('!=')})`;
        return compFnBody;
    });


    ops.set('<', function(r: SxToken[], args: SxToken[]) {
        // S expression: (< a b)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:<', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('<')})`;
        return compFnBody;
    });


    ops.set('<=', function(r: SxToken[], args: SxToken[]) {
        // S expression: (<= a b)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:<=', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('<=')})`;
        return compFnBody;
    });


    ops.set('>', function(r: SxToken[], args: SxToken[]) {
        // S expression: (> a b)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:>', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('>')})`;
        return compFnBody;
    });


    ops.set('>=', function(r: SxToken[], args: SxToken[]) {
        // S expression: (>= a b)
        //  -> S expr  : boolean
        let compFnBody = '';
        checkParamsLength('compileToken:<=', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('>=')})`;
        return compFnBody;
    });


    ops.set('$concat', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($concat listOrString1 ... listOrStringN)
        //  -> S expr  : listOrString
        let compFnBody = '';
        checkParamsLength('compileToken:+', args, 1);
        _$_vars[ctx.varsCount] = r[1];
        compFnBody += `(_$_vars[${String(ctx.varsCount++)}].concat(${
            args.map((x, idx, arr) => compileToken(arr, idx)).join(',')}))`;
        return compFnBody;
    });


    ops.set('+', function(r: SxToken[], args: SxToken[]) {
        // S expression: (+ number1 ... numberN)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:+', args, 1);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('+')})`;
        return compFnBody;
    });


    ops.set('-', function(r: SxToken[], args: SxToken[]) {
        // S expression: (- number1 ... numberN)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:-', args, 1);
        compFnBody += `(${r.length > 2 ?
            args.map((x, idx, arr) => compileToken(arr, idx)).join('-') :
            `-(${String(compileToken(r, 1))})`})`;
        return compFnBody;
    });


    ops.set('*', function(r: SxToken[], args: SxToken[]) {
        // S expression: (* number1 ... numberN)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:*', args, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('*')})`;
        return compFnBody;
    });


    ops.set('**', function(r: SxToken[], args: SxToken[]) {
        // S expression: (** number1 ... numberN)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:**', args, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('**')})`;
        return compFnBody;
    });


    ops.set('/', function(r: SxToken[], args: SxToken[]) {
        // S expression: (/ number1 ... numberN)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:/', args, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('/')})`;
        return compFnBody;
    });


    ops.set('%', function(r: SxToken[], args: SxToken[]) {
        // S expression: (% number1 ... numberN)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:%', args, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('%')})`;
        return compFnBody;
    });


    ops.set('<<', function(r: SxToken[], args: SxToken[]) {
        // S expression: (<< number shift)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:<<', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('<<')})`;
        return compFnBody;
    });


    ops.set('>>', function(r: SxToken[], args: SxToken[]) {
        // S expression: (>> number shift)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:>>', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('>>')})`;
        return compFnBody;
    });


    ops.set('>>>', function(r: SxToken[], args: SxToken[]) {
        // S expression: (>>> number shift)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:>>>', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('>>>')})`;
        return compFnBody;
    });


    ops.set('$bit-not', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($bit-not number)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:$bit-not', args, 1, 1);
        compFnBody += `(~(${compileToken(r, 1)}))`;
        return compFnBody;
    });


    ops.set('$bit-and', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($bit-and numberA numberB)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:$bit-and', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('&')})`;
        return compFnBody;
    });


    ops.set('$bit-or', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($bit-or numberA numberB)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:$bit-or', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('|')})`;
        return compFnBody;
    });


    ops.set('$bit-xor', function(r: SxToken[], args: SxToken[]) {
        // S expression: ($bit-xor numberA numberB)
        //  -> S expr  : number
        let compFnBody = '';
        checkParamsLength('compileToken:$bit-xor', args, 2, 2);
        compFnBody += `(${args.map((x, idx, arr) => compileToken(arr, idx)).join('^')})`;
        return compFnBody;
    });
}
