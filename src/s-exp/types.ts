


export type SxMacro = (state: SxParserState, name: string) => (list: SxToken[]) => SxToken;

export interface SxMacroInfo {
    name: string;
    fn: SxMacro;
}


export type SxFunc = (state: SxParserState, name: string) => (...args: any[]) => any;

export interface SxFuncInfo {
    name: string;
    fn: SxFunc;
}


export type SxSymbolResolver = (state: SxParserState, name: string) => any;

export interface SxSymbolInfo {
    name: string;
    fn: SxSymbolResolver;
}


export interface SxScope {
    isBlockLocal: boolean;
    scope: any;
}


export interface SxReservedNames {
    eval: string;
    quote: string;

    car: string;
    cdr: string;
    cons: string;
    atom: string;
    eq: string;
    list: string;

    let: string;
    lambda: string;
    self: string;
    defun: string;

    if: string;
    cond: string;

    while: string;
    doWhile: string;
    until: string;
    doUntil: string;

    get: string;
    defvar: string;
    setq: string;
    set: string;

    not: string;
    and: string;
    or: string;

    Template: string;
}

export interface SxParserConfig {
    raiseOnUnresolvedSymbol: boolean;
    enableEvalute: boolean;
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

export interface SxParserState {
    strings: TemplateStringsArray | string[];
    values: any[];

    index: number;
    pos: number;
    line: number;

    scopes: SxScope[];

    macroMap: Map<string, SxMacroInfo>;
    funcMap: Map<string, SxFuncInfo>;
    symbolMap: Map<string, SxSymbolInfo>;

    config: SxParserConfig;
}

export interface SxEof {
    eof: boolean; // true: truely EOF comes. false: detect virtual EOF.
    eofSeq?: string;
}

export interface SxExternalValue {
    value: any;
}

export interface SxSymbol {
    'symbol': string;
}

export interface SxComment {
    comment: string;
}

export interface SxDottedPair {
    car: SxToken; // left
    cdr: SxToken; // right
}

export interface SxDottedFragment {
    dotted: SxToken; // right
}


export type SxTokenChild = SxSymbol | SxDottedPair | SxDottedFragment | SxComment | SxExternalValue | string | number | boolean | null | /*SxToken*/ any[];
export type SxToken      = SxSymbol | SxDottedPair | SxDottedFragment | SxComment | SxExternalValue | string | number | boolean | null | SxTokenChild[];
export type SxChar = string | SxEof | SxExternalValue;
export type SxAtom = SxSymbol | string | number | boolean | null;
export type SxList = SxDottedPair | SxAtom[];


export interface LsxConfig {
    jsx: (comp: any, props: any, ...children: any[]) => any;
    jsxFlagment: any;
    components: object;
}



export function quote(state: SxParserState, x: any) {
    return [{symbol: state.config.reservedNames.quote}, x];
}


export function isQuoted(state: SxParserState, x: any) {
    if (Array.isArray(x) && 0 < x.length) {
        const q = isSymbol(x);
        if (q && q.symbol === state.config.reservedNames.quote) {
            return true;
        }
    }
    return false;
}


export function isSymbol(x: any, name?: string): SxSymbol | null {
    if (x && typeof x === 'object' && Object.prototype.hasOwnProperty.call(x, 'symbol')) {
        if (name !== void 0) {
            return x.symbol === name ? x : null;
        } else {
            return x;
        }
    }
    return null;
}
