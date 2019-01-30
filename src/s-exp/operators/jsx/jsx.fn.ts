// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxToken }             from '../../types';
import { isSymbol,
         quote }               from '../../ast';
import { evaluate,
         getScope }            from '../../evaluate';
import { checkParamsLength,
         checkUnsafeVarNames } from '../../errors';
import { $$first,
         $$firstAndSecond,
         $__scope,
         $$boolean }           from '../core/core.fn';



// tslint:disable-next-line:variable-name
export const $__outputIf = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__outputIf cond 'expr)
    //  -> (if cond is true ) S expr  : expr
    //  -> (if cond is false) S expr  : ()
    checkParamsLength('$__outputIf', args, 2);

    const {car, cdr} = $$firstAndSecond(...args);
    let r: SxToken = [];
    if ($$boolean(car)) {
        if (2 < args.length) {
            r.push({symbol: state.config.reservedNames.Template}, ...args.slice(1));
            r = evaluate(state, r);
        } else {
            r = evaluate(state, cdr);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__outputForOf = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__outputForOf list 'expr)
    //  -> S expr  : (Template expr ... expr)
    checkParamsLength('$__outputForOf', args, 2);

    const car = $$first(...args);
    const r: SxToken[] = [];
    if (Array.isArray(car)) {
        for (let i = 0; i < car.length; i++) {
            const x = car[i];
            const v = $__scope(state, name)(true, true, [
                ['$data', quote(state, x)],
                ['$index', i],
                ['$array', quote(state, car)],
                ['$parent', quote(state, getScope(state).scope)],
            ], ...args.slice(1));

            if (2 < args.length && Array.isArray(v)) {
                r.push(...v);
            } else {
                r.push(v);
            }
        }
    } else {
        throw new Error(`[SX] $__outputForOf: Invalid argument(s): args[0] is not array.`);
    }
    // All of r items are already evaluated.
    return evaluate(state,
        ([{symbol: state.config.reservedNames.Template}] as SxToken[])
        .concat(r.map(z => [{symbol: state.config.reservedNames.quote}, z])));
};


export const $jsxProps = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (@ (name value...)...)
    //  -> JSON    : {name: value, ...}
    const r: any = {};
    for (const x of args) {
        if (Array.isArray(x) && 0 < x.length) {
            const sym = isSymbol(x[0]);
            const keyName =
                sym ? sym.symbol :
                String(evaluate(state, x[0]));
            switch (keyName) {
            case 'style':
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (style) ...)
                        //  -> JSON    : {..., style: "", ...}
                        r[keyName] = "";
                    } else if (x.length >= 2) {
                        // S expression: (@ ... (style "styleName1: styleValue1; ..." ...) ...)
                        // S expression: (@ ... (style (styleName1 styleValue1) ...) ...)
                        //  -> JSON    : {..., style: {styleName1: styleValue1}, ...}
                        const styles: object = {};
                        for (const s of x.slice(1)) {
                            if (Array.isArray(s) && 1 < s.length) {
                                styles[String(evaluate(state, s[0]))] = String(evaluate(state, s[1]));
                            } else if (typeof s === 'string') {
                                for (const v of s.split(';')) {
                                    const matched = /^\s*(\S+)\s*:\s*(.*?)\s*$/.exec(v);
                                    if (matched) {
                                        styles[matched[1]] = matched[2];
                                    }
                                }
                            }
                        }
                        r[keyName] = styles;
                    }
                }
                break;
            case 'class': case 'styleClass':
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (class) ...)
                        //  -> JSON    : {..., class: [], ...}
                        r[keyName] = [];
                    } else if (x.length >= 2) {
                        // S expression: (@ ... (class "className1 className2 ...") ...)
                        // S expression: (@ ... (class (className1 className2 ...)) ...)
                        //  -> JSON    : {..., class: [className1 className2 ...], ...}
                        let classes: any[] = [];
                        for (const c of x.slice(1)) {
                            if (Array.isArray(c)) {
                                classes = classes.concat(c.map(z => evaluate(state, z)));
                            } else if (typeof c === 'string') {
                                classes = classes.concat(c.split(' '));
                            }
                        }
                        const cs: string[] = [];
                        const fn: (a: any[]) => void = (a) => a
                            .forEach(c => (c === null || c === void 0) ?
                                void 0 :
                                (Array.isArray(c) ? fn(c) : cs.push(String(c))));
                        fn(classes);
                        r[keyName] = cs;
                    }
                }
                break;
            case 'className':
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (class) ...)
                        //  -> JSON    : {..., class: "", ...}
                        r[keyName] = '';
                    } else if (x.length >= 2) {
                        // S expression: (@ ... (class "className1 className2 ...") ...)
                        // S expression: (@ ... (class (className1 className2 ...)) ...)
                        //  -> JSON    : {..., class: "className1 className2 ...", ...}
                        let classes: string = '';
                        for (const c of x.slice(1)) {
                            let fragment = '';
                            if (Array.isArray(c)) {
                                const cs: string[] = [];
                                const fn: (a: any[]) => void = (a) => a
                                    .map(z => evaluate(state, z))
                                    .forEach(z => (z === null || z === void 0) ?
                                        void 0 :
                                        (Array.isArray(z) ? fn(z) : cs.push(String(z))));
                                fn(c);
                                fragment = cs.join(' ');
                            } else if (typeof c === 'string') {
                                fragment = c;
                            }
                            if (0 < classes.length) classes += ' ' + fragment;
                            else classes = fragment;
                        }
                        r[keyName] = classes;
                    }
                }
                break;
            case 'dangerouslySetInnerHTML':
                {
                    if (x.length === 1) {
                        r[keyName] = {__html: ''};
                    } else if (x.length >= 2) {
                        r[keyName] = {__html: evaluate(state, x[1])};
                    } else {
                        r[keyName] = {__html:
                            evaluate(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
                            .concat(x.slice(1)))
                        };
                    }
                }
                break;
            case 'setInnerText':
                {
                    if (x.length === 1) {
                        r[keyName] = {__text: ''};
                    } else if (x.length >= 2) {
                        r[keyName] = {__text: evaluate(state, x[1])};
                    } else {
                        r[keyName] = {__text:
                            evaluate(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
                            .concat(x.slice(1)))
                        };
                    }
                }
                break;
            default:
                {
                    checkUnsafeVarNames('$jsxProps', keyName);
                    if (x.length === 1) {
                        // S expression: (@ ... (keyName) ...)
                        //  -> JSON    : {..., keyName: true, ...}
                        r[keyName] = true;
                    } else if (x.length === 2) {
                        // S expression: (@ ... (keyName value) ...)
                        //  -> JSON    : {..., keyName: value, ...}
                        r[keyName] = evaluate(state, x[1]);
                    } else {
                        // S expression: (@ ... (keyName value1 value2 ...) ...)
                        //  -> JSON    : {..., keyName: [value1, value2, ], ...}
                        r[keyName] =
                            evaluate(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
                            .concat(x.slice(1)));
                    }
                }
                break;
            }
        } else {
            throw new Error(`[SX] $jsxProps: Invalid argument(s): args[?] is not array.`);
        }
    }
    return r;
};


function getJsxTagsParams(state: SxParserState, ...args: any[]) {
    let children = args;
    let props: any = {};
    if (0 < args.length && Array.isArray(args[0])) {
        const sym = isSymbol(args[0][0], '@');

        if (sym) {
            props = $jsxProps(state, '')(...args[0].slice(1));
            children = children.slice(1);
        }
    }
    return {props, children};
}


export const $jsxStandardTag = (state: SxParserState, name: string) => (...args: any[]) => {
    const {props, children} = getJsxTagsParams(state, ...args);
    return (state.config.jsx as any)(name, props, ...children);
};


export const $jsxComponentTag = (component: any) => (state: SxParserState, name: string) => (...args: any[]) => {
    const {props, children} = getJsxTagsParams(state, ...args);
    return (state.config.jsx as any)(component, props, ...children);
};
