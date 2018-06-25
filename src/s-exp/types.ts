


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


export interface SxReservedNames {
    quote: string;
    eval: string;
    list: string;
    Template: string;
}

export interface SxParserConfig {
    raiseOnUnresolvedSymbol: boolean;
    enableEvalute: boolean;
    enableHereDoc: boolean;
    stripComments: boolean;
    strippedCommentValue: any;
    wrapExternalValue: boolean;
    reservedNames: SxReservedNames;

    jsx?: (comp: any, props: any, ...children: any[]) => any;
    JsxFragment?: any;

    macros: SxMacroInfo[];
    funcs: SxFuncInfo[];
    symbols: SxSymbolInfo[];

    funcSymbolResolverFallback?: SxFunc;
    valueSymbolResolverFallback?: SxSymbolResolver;
}

export interface SxParserState {
    strings: TemplateStringsArray;
    values: any[];

    index: number;
    pos: number;
    line: number;

    scopes: any[];

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
