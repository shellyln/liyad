

// tslint:disable-next-line:no-implicit-dependencies
import * as RedAgate from 'red-agate';
// tslint:disable-next-line:no-implicit-dependencies
import * as react from 'react';
// tslint:disable-next-line:no-implicit-dependencies
import * as ReactDOMServer from 'react-dom/server';

import { S, lisp, LM, LSX } from '../';



describe("operator.core.$=if", function() {
    it("$=if", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
            )
        `)).toEqual(`<div class="aaa bbb ccc hhh cls-8" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh!</div>`);
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class "xxx yyy" "zzz" ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
            )
        `)).toEqual(`<div class="xxx yyy zzz aaa bbb ccc hhh cls-8" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh!</div>`);
    });
    it("$=if", function() {
        const dom = react.createElement;
        const fragment = react.Fragment;
        const render = ReactDOMServer.renderToStaticMarkup;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX<react.ReactElement<any>>({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (className ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
            )
        `)).toEqual('<div class="aaa bbb ccc hhh cls-8" style="color:red;width:100%;style-1:style-value-1">Hello, asdfgh!</div>');
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (className "aaa bbb" "ccc" (($if true "hhh") ($concat "cls-" 8)) )
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
            )
        `)).toEqual('<div class="aaa bbb ccc hhh cls-8" style="color:red;width:100%;style-1:style-value-1">Hello, asdfgh!</div>');
    });
    it("$=if", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        `)).toEqual(
            `<div class="aaa bbb ccc hhh cls-8" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh!</div>` +
            `<div>Hello, abcdef, Lisp!foobar<div>qqq</div>baz</div>`
        );
    });
    it("$=if", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($list "ddd" "eee") ($if false "ggg") ($if true "hhh") ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        `)).toEqual(
            `<div class="aaa bbb ccc ddd eee hhh cls-8" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh!</div>` +
            `<div>Hello, abcdef, Lisp!foobar<div>qqq</div>baz</div>`
        );
    });
    it("$=if", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwertyy'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        `)).toEqual(``);
    });
    it("$=if", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) )
                        (dangerouslySetInnerHTML "<div style='width:1%;' class=\\"foo\\">&amp;&quot;&lt;&gt;&apos;\\\\</div>"))
                    "Hello, asdfgh!" )
            )
        `)).toEqual(
            `<div class="aaa bbb ccc hhh cls-8" style="color:red;width:100%;style-1:style-value-1;">` +
            `<div style='width:1%;' class="foo">&amp;&quot;&lt;&gt;&apos;\\</div>Hello, asdfgh!</div>`
        );
    });
});


describe("operator.core.$=for", function() {
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=for ($list 3 5 7)
                ($=if (== "qwerty" ${'qwerty'})
                    (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-i-" $index) ($concat "cls-" $data) ))
                            (style (color "red")
                                ("width" "100%")
                                (($concat "style-" 1) ($concat "style-value-" 1)) ))
                        "Hello, asdfgh! " (+ 10 $data))
                )
            )
        `))
        .toEqual(
            `<div class="aaa bbb ccc hhh cls-i-0 cls-3" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh! 13</div>` +
            `<div class="aaa bbb ccc hhh cls-i-1 cls-5" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh! 15</div>` +
            `<div class="aaa bbb ccc hhh cls-i-2 cls-7" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh! 17</div>`
        );
    });
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=for ()
                ($=if (== "qwerty" ${'qwerty'})
                    (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-i-" $index) ($concat "cls-" $data) ))
                            (style (color "red")
                                ("width" "100%")
                                (($concat "style-" 1) ($concat "style-value-" 1)) ))
                        "Hello, asdfgh! " (+ 10 $data))
                )
            )
        `))
        .toEqual('');
    });
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=for ($list 3 5 7)
                ($=if (== "qwerty" ${'qwerty'})
                    ($=for ($list 11)
                        (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-i-" ($get "$parent" "$index")) ($concat "cls-" ($get "$parent" "$data")) ))
                                (style (color "red")
                                    ("width" "100%")
                                    (($concat "style-" 1) ($concat "style-value-" 1)) ))
                            "Hello, asdfgh! " (+ 10 ($get "$parent" "$data")))
                    )
                )
            )
        `))
        .toEqual(
            `<div class="aaa bbb ccc hhh cls-i-0 cls-3" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh! 13</div>` +
            `<div class="aaa bbb ccc hhh cls-i-1 cls-5" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh! 15</div>` +
            `<div class="aaa bbb ccc hhh cls-i-2 cls-7" style="color:red;width:100%;style-1:style-value-1;">Hello, asdfgh! 17</div>`
        );
    });
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(lsx`
            ($let a null)
            ($=for ($list 1 2 3 4 5) ($set a $array))
            ($get a)
        `)
        .toEqual([1, 2, 3, 4, 5]);
    });
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(lsx`
            ($let a null)
            ($=for ($list 1 2 3 4 5)
                ($if (=== $index 2)
                    ($set a $data)
                )
            )
            ($get a)
        `)
        .toEqual(3);
    });
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(lsx`
            ($let a null)
            ($=for ($list 1 2 3 4 5)
                ($=for ($list 7)
                    ($if (=== ($get $parent $index) 2)
                        ($set a ($get $parent $data))
                    )
                )
            )
            ($get a)
        `)
        .toEqual(3);
    });
    it("$=for", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(lsx`
            ($let a null)
            ($=for ($list 1 2 3 4 5)
                ($=for ($list 7 11 13)
                    ($if (=== ($get $index) 2)
                        ($set a ($get $data))
                    )
                )
            )
            ($get a)
        `)
        .toEqual(13);
    });
});


describe("jsx prototype pollution", function() {
    it("jsx prototype pollution 1", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(() => lsx`
            (Hello (@ (style (__proto__ "foo") ) ))
        `).toThrow();
    });
    it("jsx prototype pollution 2", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(() => lsx`
            (Hello (@ (style ("__proto__" "foo") ) ))
        `).toThrow();
    });
});


// describe("operator.core.@", function() {
//     it("foo", function() {
//         expect(1).toEqual(1);
//     });
// });


// describe("operator.core.jsxStandardTag", function() {
//     it("foo", function() {
//         expect(1).toEqual(1);
//     });
// });


// describe("operator.core.jsxComponentTag", function() {
//     it("foo", function() {
//         expect(1).toEqual(1);
//     });
// });
