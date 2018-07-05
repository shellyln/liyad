
// tslint:disable-next-line:no-implicit-dependencies
import * as RedAgate from 'red-agate';
// tslint:disable-next-line:no-implicit-dependencies
import * as react from 'react';
// tslint:disable-next-line:no-implicit-dependencies
import * as ReactDOMServer from 'react-dom/server';

import { S, lisp, LM, LSX } from '../';



describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(
lisp`
($defun fac (n)
    ($if (== n 0)
        1
        (* n (fac (- n 1))) ) )
($defun multipy (x y)
    (* x y) )

(multipy 4 (fac 3))
`
        ));
        expect(1).toEqual(1);
    });
});



describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(S`
# comment
(foo bar "baz" 12.345 -34.567 +56.789 ("qqq" www) #|
comment2
|#)
() ; comment3
()
        `));
        expect(1).toEqual(1);
    });
});

describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(S`
# comment
(foo bar "baz" 12.345 -34.567 +56.789 ("qqq" www) #|
comment2
|#)
() ; comment3
(${999}${"aaabbb"})
        `));
        expect(1).toEqual(1);
    });
});

describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(S`
# comment
'(foo bar "baz" 12.345 -34.567 +56.789 '("qqq" www) #|
comment2
|#)
() ; comment3
(${999}${"aaabbb"})
        `));
        expect(1).toEqual(1);
    });
});



describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(LM`
($quote 1)
        `));
        expect(1).toEqual(1);
    });
});

describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(LM`
($list ($list 53 54 55) 56 ($list 57 58 59))
        `));
        expect(1).toEqual(1);
    });
});

describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(LM`
($list ($quote ($list ($list 53 54 55) 56 ($list 57 58 59))))
        `));
        expect(1).toEqual(1);
    });
});

describe("foo", function() {
    it("foo", function() {
        console.log(JSON.stringify(LM`
'${[777, 888, 999]}                           ;; keep as external value
($list ${[321, 432, 543]})                    ;; to be [[321 432 543]]
($eval '${[421, 532, 643]})                   ;; to be [421 532 643]
;${[521, 632, 743]}                           ;; to be syntax error
($=if true ${[556677, 667788]})               ;; to be [556677 667788]
($=if false ${[556671, 667781]})              ;; to be []
($=if true ${[556672, 667782]} "aaa")         ;; to be [[556672 667782] "aaa"]
($=if true "bbb")                             ;; to be "bbb"
($eval ($if false ${[556673, 667783]} "aaa")) ;; to be []
($eval ($if true ${[556674, 667784]} "aaa"))  ;; to be [[556674 667784] "aaa"]
        `));
        expect(1).toEqual(1);
    });
});



describe("foo", function() {
    it("foo", function() {
        const lsxRa = LSX({
            jsx: RedAgate.createElement,
            jsxFlagment: RedAgate.Template,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
            },
        });
        console.log(RedAgate.renderAsHtml_noDefer(RedAgate.createElement(RedAgate.Html5, {})));
        console.log(RedAgate.renderAsHtml_noDefer(
            lsxRa`
(Html5
    ($=for ($list 1 2 3) (div "Hello!" $data) )
    (Svg (@ (width 209)
            (height 295)
            (unit "mm") )
        (Rect (@ (x 10)
                 (y 10)
                 (width 50)
                 (height 100)
                 (lineWidth 0.1)
                 (stroke) ))
    )
)
            `)
        );
        expect(1).toEqual(1);
    });
});

describe("foo", function() {
    it("foo", function() {
        const libs = [{
            libName: 'React',
            dom: react.createElement as (c: any, props: any, ...children: any[]) => any,
            Fragment: react.Fragment,
            render: ReactDOMServer.renderToStaticMarkup as (el: any) => string,
        }, {
            libName: 'RedAgate',
            dom: RedAgate.createElement as (c: any, props: any, ...children: any[]) => any,
            Fragment: RedAgate.Template,
            render: RedAgate.renderAsHtml_noDefer as (el: any) => string,
        }];

        for (const lib of libs) {
            const {libName, dom, Fragment, render} = lib;
            const Hello = (props: any) =>
                dom('div', {},
                    `Hello, ${props.name}, ${libName} and Lisp!`,
                    ...(Array.isArray(props.children) ? props.children : [props.children])
                );

            const lsx = LSX<React.ReactElement<any>>({
                jsx: dom,
                jsxFlagment: Fragment,
                components: {
                    Hello,
                },
            });

            console.log(render(dom('div', {}, `Hello, ${libName}!`)));
            console.log(render(
lsx`
(html
    #|  Here is a block comment (1) !
     |  Here is a block comment (2) !
     |#
    ($=if (== "React" ${libName})
        (div (@ (className ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) )))
            "Hello, React!" ))
    ($=if (== "RedAgate" ${libName})
        (div (@ (class     ("ddd" "eee" "fff" ($if false "iii" null) ($if true "jjj" null) ($concat "cls-" 9) )))
            "Hello, RedAgate!" ))

    ;; Control flow in Lisp
    ($=for ($list 1 2 3)
        (Hello (@ (key $data)
                  (name ($concat "Jane Doe " $data)))
            "Do loop in Lisp !
            count: " $data
            (div (@ (className ($data "aaa" "bbb" ($concat "cls-" $data) ))
                    (style (color "red")
                           (width "100%")
                           (($concat "style-" $data) ($concat "style-value-" $data)) )
                    (($concat "prop-" $data) ($concat "value-" $data)) )
                *** $data ***
            )
        )
        ($=if (== (% ($get "$data") 2) 1)
            "1: Data " $data " is odd!"       ;; normal string literal.
            2: Data $data is odd!!            ;; an evaluated undefined symbol returns symbol name string.
            """
            3: Data %%%($eval $data) is odd!!
            """                               ;; here-document notation.
        )
    )

    ;; Control flow in JavaScript
    ${[1, 2, 3].map(x =>
        lsx`
        (Hello (@ (key ${x})
                  (name ($concat "John Smith " ${x})))
            "Do loop in JavaScript !
            count: " ${x}
        )`
    )}

#|  Title: Alice in Wonderland
 |  Author: Lewis Carroll
 |#
"""
Alice was beginning to get very tired of sitting by her sister on the
bank, and of having nothing to do. Once or twice she had peeped into the
book her sister was reading, but it had no pictures or conversations in
it, %%%(b "\\"and what is the use of a book,\\"") thought Alice,
%%%(b "\\"without pictures or conversations?\\"")
"""

"""section
So she was considering in her own mind (as well as she could, for the
day made her feel very sleepy and stupid), whether the pleasure of
making a daisy-chain would be worth the trouble of getting up and
picking the daisies, when suddenly a %%%(b "White Rabbit") with pink eyes ran
close by her.
"""

"""section@{(id "paragraph-3") (className "book-body")}
There was nothing so %%%(b "very") remarkable in that, nor did Alice think it so
very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh
dear! I shall be too late!" But when the Rabbit actually took a watch
out of its waistcoat-pocket and looked at it and then hurried on, Alice
started to her feet, for it flashed across her mind that she had never
before seen a rabbit with either a waistcoat-pocket, or a watch to take
out of it, and, burning with curiosity, she ran across the field after
it and was just in time to see it pop down a large rabbit-hole, under
the hedge. In another moment, down went Alice after it!
"""
)`
                )
            );
        }
        expect(1).toEqual(1);
    });
});
