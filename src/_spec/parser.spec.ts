

import { S, lisp, lisp_async, LM, LM_async, LSX, LSX_async } from '../';



describe("parser.parse.dotted-pair", function() {
    it(". b -> throw", function() {
        expect(() => lisp`(. 2)`).toThrow();
    });
    it("a . b c -> throw", function() {
        expect(() => lisp`(1 . 2 3)`).toThrow();
    });
    it("a . b -> value", function() {
        expect(lisp`(1 . 2)`).toEqual({car: 1, cdr: 2} as any);
    });
    it("a . b -> value", function() {
        expect(lisp`((* 3 5) . (* 7 11))`).toEqual({car: 15, cdr: 77} as any);
    });
    it("a . () -> (a)", function() {
        expect(lisp`(3 . ())`).toEqual([3]);
    });
    it("a . nil -> (a)", function() {
        expect(lisp`(3 . nil)`).toEqual([3]);
    });
    it("a . null -> value", function() {
        expect(lisp`(3 . null)`).toEqual({car: 3, cdr: null} as any);
    });
    it("a . undefined -> value", function() {
        expect(lisp`(3 . undefined)`).toEqual({car: 3, cdr: void 0} as any);
    });
    it("a . (b) -> (a b)", function() {
        expect(lisp`(3 . '(5))`).toEqual([3, 5]);
    });
});


describe("repl", function() {
    it("not a repl", function() {
        expect(lisp`($let foo 3)`).toEqual(3);
        expect(lisp`($list foo)`).toEqual(['foo']);
    });
    it("repl", function() {
        const repl = lisp.repl();
        expect(repl`($let foo 3)`).toEqual(3);
        expect(repl`($list foo)`).toEqual([3]);
    });
    it("not a repl async", function(done) {
        (async () => {
            try {
                expect(await lisp_async`($let-async foo 3)`).toEqual(3);
                expect(await lisp_async`($list foo)`).toEqual(['foo']);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("repl async", function(done) {
        const repl = lisp_async.repl();
        (async () => {
            try {
                expect(await repl`($let-async foo 3)`).toEqual(3);
                expect(await repl`($list foo)`).toEqual([3]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
});


describe("spread", function() {
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...($list 7 11) 13)`).toEqual([3, 5, 7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...($list 7) 13)`).toEqual([3, 5, 7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...($list) 13)`).toEqual([3, 5, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...($list 7 11))`).toEqual([5, 7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...($list 7))`).toEqual([5, 7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...($list))`).toEqual([5]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7 11) 13)`).toEqual([7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7) 13)`).toEqual([7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list) 13)`).toEqual([13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7 11))`).toEqual([7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7))`).toEqual([7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list))`).toEqual([]);
    });

    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...'(7 11) 13)`).toEqual([3, 5, 7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...'(7) 13)`).toEqual([3, 5, 7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...'() 13)`).toEqual([3, 5, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...'(7 11))`).toEqual([5, 7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...'(7))`).toEqual([5, 7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...'())`).toEqual([5]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7 11) 13)`).toEqual([7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7) 13)`).toEqual([7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'() 13)`).toEqual([13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7 11))`).toEqual([7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7))`).toEqual([7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'())`).toEqual([]);
    });
});


describe("tail call optimization", function() {
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 5 6 0)
        `).toEqual(6);
    });
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 6 6 0)
        `).toEqual(6);
    });
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 7 6 0)
        `).toEqual(7);
    });
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 9 6 0)
        `).toEqual(9);
    });

    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 5 6 0)
        `).toEqual(6);
    });
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 6 6 0)
        `).toEqual(6);
    });
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 7 6 0)
        `).toEqual(7);
    });
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 9 6 0)
        `).toEqual(9);
    });

    it("optimization", function() {
        expect(lisp`
            ($local ()
                ($let fib-sub (-> (n a b)
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]);
    });

    it("no optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        (fib-sub (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 2, 5, 9, 16, 27, 45, 74, 121, 197, 320, 519, 841, 1362, 2205, 3569, 5776, 9347, 15125, 24474]);
    });
    it("optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 2, 5, 9, 16, 27, 45, 74, 121, 197, 320, 519, 841, 1362, 2205, 3569, 5776, 9347, 15125, 24474]);
    });

    it("no optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($set b (+ b 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        (fib-sub (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 3, 7, 13, 23, 39, 65, 107, 175, 285, 463, 751, 1217, 1971, 3191, 5165, 8359, 13527, 21889, 35419]);
    });
    it("optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($set b (+ b 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 3, 7, 13, 23, 39, 65, 107, 175, 285, 463, 751, 1217, 1971, 3191, 5165, 8359, 13527, 21889, 35419]);
    });
});


describe("compiler", function() {
    it("compiler 1", function() {
        expect(lisp`
            ($$defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 9 6 0)
        `).toEqual(9);
    });
    it("compiler 2", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub ($$closure (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($set b (+ b 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($$defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 3, 7, 13, 23, 39, 65, 107, 175, 285, 463, 751, 1217, 1971, 3191, 5165, 8359, 13527, 21889, 35419]);
    });
});


describe("shorthands", function() {
    it("shorthands 1", function() {
        expect(lisp`
            ($let foo (#
                (bar)
                (baz (#)) ))
            (::foo:bar= 7)
            (::foo:baz:boo= 13)
            ($list ::foo:bar ::foo:baz:boo)
        `).toEqual([7, 13]);
    });
    it("shorthands 2", function() {
        class X {
            public x: number;
            constructor() {
                this.x = 3;
            }
            public mul(y: number, z: number) {
                return this.x * y * z;
            }
        }
        expect(lisp`
            ($let foo (#
                (bar)
                (baz ${new X()}) ))
            (::foo:baz@mul 5 7)
        `).toEqual(105);
    });
});
