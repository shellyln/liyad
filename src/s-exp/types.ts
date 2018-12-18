// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export type SxMacro = (state: SxParserState, name: string, formalArgs?: SxSymbol[]) => (list: SxToken[]) => SxToken;

export interface SxMacroInfo {
    name: string;
    fn: SxMacro;

    // TODO: overloading
    formalArgs?: SxSymbol[];
    lastIsSpread?: boolean;
    next?: SxMacroInfo;
}


export type SxFunc = (state: SxParserState, name: string) => (...args: any[]) => any;

export interface SxFuncInfo {
    name: string;
    fn: SxFunc;

    // TODO: overloading
    // formalArgs?: SxSymbol[];
    // lastIsSpread?: boolean;
    // next?: SxFuncInfo;
}


export type SxSymbolResolver = (state: SxParserState, name: string) => any;

export interface SxSymbolInfo {
    name: string;
    fn: SxSymbolResolver;
}


export interface CapturedScopes { [s: string]: { [s: string]: any; }; }

export interface SxScope {
    isBlockLocal: boolean;
    scope: any;           // { [s: string]: any; };
    capturedScopes?: CapturedScopes;
}


export interface SxReservedNames {
    eval: string;
    quote: string;
    backquote: string;
    unquote: string;
    spread: string;
    splice: string;

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
    call: string;

    not: string;
    and: string;
    or: string;

    isSymbol: string;
    gensym: string;
    raise: string;
    catch: string;

    Template: string;
}

export interface SxParserConfig {
    raiseOnUnresolvedSymbol: boolean;
    enableEvaluate: boolean;
    enableHereDoc: boolean;
    enableSpread: boolean;
    enableSplice: boolean;
    enableShorthands: boolean;
    enableVerbatimStringLiteral: boolean;
    enableTailCallOptimization: boolean;
    stripComments: boolean;
    wrapExternalValue: boolean;
    reservedNames: SxReservedNames;
    returnMultipleRoot: boolean;
    maxEvalCount: number;

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

    evalCount: number;

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

    // TODO: debug info
    // _fileName?: string;
    // _line?: number;
    // _col?: number;
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



export type CompilerOperator = (r: SxToken[], args: SxToken[]) => string;


export interface CompilerContext {
    _$_vars: any[];
    varsCount: number;
    varNames: Map<string, string>;
    varNamesCount: number;
    varDefs: string;
    ops: Map<string, CompilerOperator>;
    makeScope: (scoped: () => void) => void;
    compileToken: (body: any[], i: number) => string;
}


export interface LsxConfig {
    jsx: (comp: any, props: any, ...children: any[]) => any;
    jsxFlagment: any;
    components: object;
}


export class FatalError extends Error {
    public constructor(message?: string | undefined) {
        super(message);
    }
}


export class MaxEvaluationCountError extends FatalError {
    public constructor() {
        super(`[SX] evaluate: The maximum count of evaluations has been exceeded.`);
    }
}


export class ScriptTerminationError extends FatalError {
    public constructor(where: string) {
        super(`[SX] ${where}: Unexpected termination of script.`);
    }
}


export interface SExpressionRepl<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): R;
    sync: (strings: TemplateStringsArray | string, ...values: any[]) => R;
}


export interface SExpressionTemplateFn<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): R;
    evaluateAST: (ast: SxToken[]) => R;
    repl: () => SExpressionRepl<R>;
    setGlobals: (globals: object) => SExpressionTemplateFn<R>;
    appendGlobals: (globals: object) => SExpressionTemplateFn<R>;
    setStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionTemplateFn<R>;
    setStartupAST: (ast: SxToken[]) => SExpressionTemplateFn<R>;
    appendStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionTemplateFn<R>;
    appendStartupAST: (ast: SxToken[]) => SExpressionTemplateFn<R>;
    install: (installer: (config: SxParserConfig) => SxParserConfig) => SExpressionTemplateFn<R>;
}


export interface SExpressionAsyncRepl<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): Promise<R>;
    sync: (strings: TemplateStringsArray | string, ...values: any[]) => Promise<R>;
}


export interface SExpressionAsyncTemplateFn<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): Promise<R>;
    evaluateAST: (ast: SxToken[]) => Promise<R>;
    repl: () => SExpressionAsyncRepl<R>;
    setGlobals: (globals: object) => SExpressionAsyncTemplateFn<R>;
    appendGlobals: (globals: object) => SExpressionAsyncTemplateFn<R>;
    setStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionAsyncTemplateFn<R>;
    setStartupAST: (ast: SxToken[]) => SExpressionAsyncTemplateFn<R>;
    appendStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionAsyncTemplateFn<R>;
    appendStartupAST: (ast: SxToken[]) => SExpressionAsyncTemplateFn<R>;
    install: (installer: (config: SxParserConfig) => SxParserConfig) => SExpressionAsyncTemplateFn<R>;
}
