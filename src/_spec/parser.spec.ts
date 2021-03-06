

// tslint:disable-next-line:no-implicit-dependencies
import * as RedAgate from 'red-agate';
import { S, lisp, lisp_async, LM, LM_async, LSX, LSX_async,
    SExpression, defaultConfig, installCore, installSequence, installArithmetic } from '../';



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

    // TODO: generated code don't check actual arguments length.
    // it("compiler 3a", function() {
    //     expect(() => lisp`
    //         ($$defun foo (a b ...c)
    //             ($list ($list a) ($list b) c)
    //         )
    //         (foo 1)
    //     `).toThrow();
    // });
    it("compiler 3b", function() {
        expect(lisp`
            ($$defun foo (a b ...c)
                ($list ($list a) ($list b) c)
            )
            (foo 1 2)
        `).toEqual([[1], [2], []]);
    });

    it("compiler 3c", function() {
        expect(lisp`
            ($$defun foo (a b ...c)
                ($list ($list a) ($list b) c)
            )
            (foo 1 2 3)
        `).toEqual([[1], [2], [3]]);
    });
    it("compiler 3d", function() {
        expect(lisp`
            ($$defun foo (a b ...c)
                ($list ($list a) ($list b) c)
            )
            (foo 1 2 3 4)
        `).toEqual([[1], [2], [3, 4]]);
    });
    it("compiler 4a", function() {
        expect(lisp`
            ($let fn (-> (...a) ($concat ...a)) )
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4b0a", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn "x")
        `).toEqual('x');
    });
    it("compiler 4b0a2", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a ...a)) )
            (fn "x")
        `).toEqual('xx');
    });
    it("compiler 4b0b", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn ($list 3))
        `).toEqual([3]);
    });
    it("compiler 4b0b", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a ...a)) )
            (fn ($list 3))
        `).toEqual([3, 3]);
    });
    it("compiler 4b1", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4b1a", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn ($list 3) ($list 5))
        `).toEqual([3, 5]);
    });
    it("compiler 4b2", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a ...a)) )
            (fn ($list 3) ($list 5))
        `).toEqual([3, 5, 3, 5]);
    });
    it("compiler 4b3", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat "p")) )
            (fn "x" "y")
        `).toEqual('p');
    });
    it("compiler 4b4", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat "p" "q")) )
            (fn "x" "y")
        `).toEqual('pq');
    });
    it("compiler 4c", function() {
        expect(lisp`
            ($defun fn (...a) ($concat ...a))
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4d", function() {
        expect(lisp`
            ($$defun fn (...a) ($concat ...a))
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4d2", function() {
        expect(lisp`
            ($$defun fn (a b) ($concat a b))
            (fn "x" "y")
        `).toEqual('xy');
    });

    it("compiler 4e", function() {
        expect(lisp`
            ($defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(20);
    });
    it("compiler 4fa", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(20);
    });
    it("compiler 4fb", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6)
        `).toEqual(19);
    });
    it("compiler 4fc", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6 1 4)
        `).toEqual(24);
    });
    it("compiler 4fd", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ ...z x y)
            )
            (fn 13 6 1)
        `).toEqual(20);
    });
    it("compiler 4fe", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ ...z x y)
            )
            (fn 13 6)
        `).toEqual(19);
    });
    it("compiler 4ff", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ ...z x y)
            )
            (fn 13 6 1 4)
        `).toEqual(24);
    });

    it("compiler -4e", function() {
        expect(lisp`
            ($defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(6);
    });
    it("compiler -4fa", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(6);
    });
    it("compiler -4fb", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6)
        `).toEqual(7);
    });
    it("compiler -4fc", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6 1 4)
        `).toEqual(2);
    });
    it("compiler -4fd", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- ...z x y)
            )
            (fn 13 6 1)
        `).toEqual(-18);
    });
    it("compiler -4fe", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- ...z x y)
            )
            (fn 13 6)
        `).toEqual(7);
    });
    it("compiler -4ff", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- ...z x y)
            )
            (fn 13 6 1 4)
        `).toEqual(-22);
    });
    it("compiler 4g1", function() {
        expect(lisp`
            ($$defun fn()
                (+ 3)
            )
            (fn)
        `).toEqual(3);
    });
    it("compiler 4g2", function() {
        expect(lisp`
            ($$defun fn()
                (+ 3 5)
            )
            (fn)
        `).toEqual(8);
    });
    it("compiler 4g3", function() {
        expect(lisp`
            ($$defun fn()
                (+ 3 5 7)
            )
            (fn)
        `).toEqual(15);
    });
    it("compiler 4h1", function() {
        expect(lisp`
            ($$defun fn()
                (- 3)
            )
            (fn)
        `).toEqual(-3);
    });
    it("compiler 4h2", function() {
        expect(lisp`
            ($$defun fn()
                (- 3 5)
            )
            (fn)
        `).toEqual(-2);
    });
    it("compiler 4g3", function() {
        expect(lisp`
            ($$defun fn()
                (- 3 5 7)
            )
            (fn)
        `).toEqual(-9);
    });

    /*
    // TODO: compiler bugs
    it("compiler 5a", function() {
        // Error: [SX] compileToken:$__let: Invalid argument length: expected: 1 / args: 2
        expect(lisp`
            ($defmacro FOR (!i <[> <FROM> s <TO> e <]> ...body)
                \`($last
                    ($local ((,i ,s))
                        ($while (<= ,i ,e)
                            ,@body
                            ($set ,i (+ ,i 1)) ))))

            ($$defun foo ()
                ($let c1   0)
                ($let c2 100)
                (FOR p [ FROM (+ 1) TO (+ 6 -3) ]
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5a2", function() {
        // Error: [SX] compileToken:$__let: Invalid argument length: expected: 1 / args: 2
        expect(lisp`
            ($$defun foo ()
                ($let c1   0)
                ($let c2 100)
                ($last
                    ($local ((p (+ 1)))
                        ($while (<= p (+ 6 -3))
                            ($set c1 (+ c1 p))
                            ($set c2 (+ c2 p))
                            ($set p (+ p 1)) )))

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5b", function() {
        // TypeError: (intermediate value)(intermediate value) is not a function
        expect(lisp`
            ($defmacro FOR (!i <[> <FROM> s <TO> e <]> ...body)
                \`($last
                    ($local ((,i ,s))
                        ($while (<= ,i ,e)
                            ,@body
                            ($set ,i (+ ,i 1)) ))))

            ($let c1   0)
            ($let c2 100)
            ($$defun foo ()
                (FOR p [ FROM (+ 1) TO (+ 6 -3) ]
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5b2", function() {
        // TypeError: (intermediate value)(intermediate value) is not a function
        expect(lisp`
            ($let c1   0)
            ($let c2 100)
            ($$defun foo ()
                ($last
                    ($local ((p (+ 1)))
                        ($while (<= p (+ 6 -3))
                            ($set c1 (+ c1 p))
                            ($set c2 (+ c2 p))
                            ($set p (+ p 1)) )))

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5b3", function() {
        // TypeError: (intermediate value)(intermediate value) is not a function
        expect(lisp`
            ($let c1   0)
            ($let c2 100)
            ($let p (+ 1))
            ($$defun foo ()
                ($while (<= p (+ 6 -3))
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p))
                    ($set p (+ p 1)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, 4, "i", "s", "e"]);
    });
    it("compiler 5b4", function() {
        // Error: [SX] compileToken:$__let: Invalid argument length: expected: 1 / args: 2.
        expect(lisp`
            ($$defun foo ()
                ($let c1   0)
                ($let c2 100)
                ($let p (+ 1))
                ($while (<= p (+ 6 -3))
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p))
                    ($set p (+ p 1)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, 4, "i", "s", "e"]);
    });
    it("compiler 999", function() {
        expect(lisp`
            (+ 0)
        `).toEqual(0);
    });
    */
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


describe("splice", function() {
    it("splice 1", function() {
        expect(lisp`
            ($list 1 2 3 ($splice (4 5)) 6 7)
        `).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it("splice 2", function() {
        expect(lisp`
            ($list 1 2 3 ($splice 4 5) 6 7)
        `).toEqual([1, 2, 3, 4, 6, 7]);
    });
    it("splice 3", function() {
        expect(lisp`
            ($list 1 2 3 ($quote ($splice (4 5))) 6 7)
        `).toEqual([1, 2, 3, 4, 6, 7]);
    });
    it("splice 4", function() {
        expect(lisp`
            ($list 1 2 3 '($splice (4 5)) 6 7)
        `).toEqual([1, 2, 3, 4, 6, 7]);
    });
});


describe("string literal", function() {
    it("string literal 1", function() {
        expect(lisp`
            ($last "a\\nb\\tc")
        `).toEqual("a\nb\tc");
    });
    it("string literal 2", function() {
        expect(lisp`
            ($last @"a\\nb\\tc")
        `).toEqual("a\\nb\\tc");
    });
    it("string literal 3", function() {
        expect(lisp`
            ($last @123)
        `).toEqual("@123");
    });
});


describe("$eval", function() {
    it("$eval 1a", function() {
        expect(lisp`
            ($eval '(+ 1 2))
        `).toEqual(3);
    });
    it("$eval 1b", function() {
        expect(lisp`
            ($eval ($quote (+ 1 2)))
        `).toEqual(3);
    });
    it("$eval 2a", function() {
        expect(lisp`
            ($eval \`(+ 1 2))
        `).toEqual(3);
    });
    it("$eval 2b", function() {
        expect(lisp`
            ($eval ($backquote (+ 1 2)))
        `).toEqual(3);
    });
    it("$eval 3a", function() {
        expect(lisp`
            '(+ 1 2)
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
    it("$eval 3b", function() {
        expect(lisp`
            ($quote (+ 1 2))
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
    it("$eval 4a", function() {
        expect(lisp`
            \`(+ 1 2)
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
    it("$eval 4b", function() {
        expect(lisp`
            ($backquote (+ 1 2))
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
});


describe("prototype pollution", function() {
    it("prototype pollution 0", function() {
        expect(() => lisp`
            __proto__
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 1", function() {
        expect(() => lisp`
            ($let x (#))
            ($set (x "__proto__" "foo") 1234)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 2", function() {
        expect(() => lisp`
            ($let x (# (bar (#))))
            ($set (x "bar" "__proto__" "foo") 1234)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 3", function() {
        expect(() => lisp`
            ($let __proto__ (# (foo 1234)))
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 4", function() {
        expect(() => lisp`
            ($let x (#))
            ($let y ($get x __proto__))
            ($set (y foo) 1234)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 5", function() {
        expect(() => lisp`
            (# (__proto__ (# (foo 1234))))
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 6", function() {
        expect(() => lisp`
            ($let x 0)
            ($for __proto__ of '((# (foo 1234)))
                ($set x 1)
            )
            ($get x)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 7", function() {
        expect(() => lisp`
            ($let x 0)
            ($repeat __proto__ of 10
                ($set x 1)
            )
            ($get x)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 8", function() {
        expect(() => lisp`
            ($local ((__proto__ (# (foo 1234))))
                1
            )
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 9", function() {
        expect(() => lisp`
            ($defun __proto__ () 1234)
            (__proto__)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 9b", function() {
        expect(() => lisp`
            ($$defun __proto__ () 1234)
            (__proto__)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 10", function() {
        expect(() => lisp`
            ($defmacro __proto__ () 1234)
            (__proto__)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 11", function() {
        expect(() => lisp`
            ($let x (#))
            ($call x __proto__)
            ($get x)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 12", function() {
        expect(() => lisp`
            ($let x (<- __proto__))
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 13", function() {
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
        expect(() => render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (__proto__ (# (foo 1234)))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        `)).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
});


describe("(compile) prototype pollution", function() {
    it("(compile) prototype pollution 0", function() {
        expect(() => lisp`
        ($$defun fn ()
            __proto__
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 1", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (#))
            ($set (x "__proto__" "foo") 1234)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 2", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (# (bar (#))))
            ($set (x "bar" "__proto__" "foo") 1234)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 3", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let __proto__ (# (foo 1234)))
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 4", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (#))
            ($let y ($get x __proto__))
            ($set (y foo) 1234)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 5", function() {
        expect(() => lisp`
        ($$defun fn ()
            (# (__proto__ (# (foo 1234))))
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 6", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x 0)
            ($for __proto__ of '((# (foo 1234)))
                ($set x 1)
            )
            ($get x)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 7", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x 0)
            ($repeat __proto__ of 10
                ($set x 1)
            )
            ($get x)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 8", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($local ((__proto__ (# (foo 1234))))
                1
            )
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 9", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($defun __proto__ () 1234)
            (__proto__)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 9b", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($$defun __proto__ () 1234)
            (__proto__)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 10", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($defmacro __proto__ () 1234)
            (__proto__)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 11", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (#))
            ($call x __proto__)
            ($get x)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 12", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (<- __proto__))
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 13", function() {
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
        expect(() => render(lsx`
        ($$defun fn ()
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (__proto__ (# (foo 1234)))
                        (style (color "red")
                                ("width" "100%")
                                (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        )
        (fn)
        `)).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
});


describe("prototype pollution from .constructor.prototype", function() {
    // NOTE: test vulnerability (issue #1)
    it("prototype pollution from .constructor.prototype 1", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn1: any = parse(`( -> (match)
                (::match:constructor:prototype:foo= 1)
            )`);
        expect(() => fn1({})).toThrow();
        expect(obj.foo).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 2", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn2: any = parse(`( -> (match)
                (::match:constructor@assign ::match:constructor:prototype (# ("bar" 2)) )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 3", function() {
        // NOTE: "constructor", "prototype" are acceptable names if they appear independently.
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn1: any = parse(`( -> (match)
            ($let constructor 11)
            ($let prototype 13)
            ($list constructor prototype)
        )`);
        expect(fn1({})).toEqual([11, 13]);
        expect(obj.foo).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 4", function() {
        // NOTE: "prototype" are acceptable names if they appear the next to non-function value.
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn1: any = parse(`( -> (match)
            (::match:constructor= (#))
            (::match:constructor:prototype= (#))
            (::match:constructor:prototype:foo= 1)
        )`);
        expect(fn1({})).toEqual(1);
        expect(obj.foo).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 5", function() {
        // NOTE: ({}).constructor === Object

        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        // TypeError: Immutable prototype object '#<Object>' cannot have their prototype set
        //
        // http://www.ecma-international.org/ecma-262/7.0/#sec-immutable-prototype-exotic-objects
        //   > An immutable prototype exotic object is an exotic object that has an immutable [[Prototype]] internal slot.
        // https://stackoverflow.com/questions/41076421/uncaught-typeerror-immutable-prototype-object-object-cannot-have-their-pro
        //   > This is new in ES7 (aka ES2016). The builtin prototype object Object.prototype
        //   > is now an Immutable Prototype Exotic Objects which has its [[prototype]] internal slot locked down.
        const fn2: any = parse(`( -> (match)
                (::match:constructor@setPrototypeOf
                    (::match:constructor@getPrototypeOf (#) )
                    (# ("bar" 2)) )
            )`);
        // expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 6a", function() {
        // NOTE: ({}).constructor === Object

        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn2: any = parse(`( -> (match)
                (::match:constructor@assign
                    (::match:constructor@getPrototypeOf (#) )
                    (# ("bar" 2)) )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 6b", function() {
        // NOTE: ({}).constructor === Object

        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn2: any = parse(`( -> (match)
                ($object-assign
                    (::match:constructor@getPrototypeOf (#) )
                    (# ("bar" 2)) )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 7a", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn2: any = parse(`( -> (match)
                (::match:constructor:prototype@__defineGetter__
                    "bar"
                    (-> () 2) )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 7b", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn2: any = parse(`( -> (match)
                (::match:constructor@__defineGetter__
                    "bar"
                    (-> () 2) )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("prototype pollution from .constructor.prototype 8", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn2: any = parse(`( -> (match)
                (::match:constructor@defineProperty
                    ::match:constructor:prototype
                    "bar"
                    (# (get (-> () 2))) )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
});


describe("leaking dangerous things", function() {
    // NOTE: test vulnerability (issue #1)
    it('Can\'t Function.call(untrusted code)', () => {
        // NOTE: ({}).toString.constructor === Function
        //       Function.prototype === Function.__proto__
        //       Function.__proto__.__proto__.__proto__ === null
        //       Function.__proto__.__proto__ === ({}).__proto__
        //
        //       dangerous things:
        //           (some_function).constructor
        //           Function.__proto__.arguments
        //           Function.__proto__.caller
        //           Function.__proto__.__proto__.call
        //
        // NOTE: arguments, caller are not accessible in strict mode

        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);

        // returns the global object
        const rule: any = parse(`( -> (match)
            ((::match:toString:constructor@call null "return this" ) ())
        )`);
        expect(() => rule({})).toThrow();
    });
    it('function\'s prototypes members', () => {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);

        // returns "[object Null]"
        const rule: any = parse(`( -> (match)
            (::match:toString@call null "return this" )
        )`);
        expect(() => rule({})).toThrow();
    });
});


describe("(compile) prototype pollution from .constructor.prototype", function() {
    // NOTE: test vulnerability (issue #1)
    it("(compile) prototype pollution from .constructor.prototype 1", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        const fn1: any = parse(`( => (match)
                (::match:constructor:prototype:foo= 1)
            )`);
        expect(() => fn1({})).toThrow();
        expect(obj.foo).toBeUndefined();
    });
    it("(compile) prototype pollution from .constructor.prototype 2", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        // BUG: compiler bug occurs!
        //       Error: [SX] compileToken: First item of list is not a function: "bar".
        //
        // const fn2: any = parse(`( => (match)
        //         (::match:constructor@assign ::match:constructor:prototype (# ("bar" 2)) )
        //     )`);
        const fn2: any = parse(`
            ($let z (# ("bar" 2)))
            (|=> (match) use (z)
                (::match:constructor@assign ::match:constructor:prototype z)
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("(compile) prototype pollution from .constructor.prototype 6a", function() {
        // NOTE: ({}).constructor === Object

        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        // BUG: compiler bug occurs!
        //       Error: [SX] compileToken: First item of list is not a function: "bar".
        //
        // const fn2: any = parse(`( => (match)
        //         (::match:constructor@assign
        //             (::match:constructor@getPrototypeOf (#) )
        //             (# ("bar" 2)) )
        //     )`);
        const fn2: any = parse(`
            ($let z (# ("bar" 2)))
            (|=> (match) use (z)
                (::match:constructor@assign
                    (::match:constructor@getPrototypeOf (#) )
                    z )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
    it("(compile) prototype pollution from .constructor.prototype 6b", function() {
        // NOTE: ({}).constructor === Object

        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);
        const obj: any = {};

        // BUG: compiler bug occurs!
        //       Error: [SX] compileToken: First item of list is not a function: "bar".
        //
        // const fn2: any = parse(`( => (match)
        //         ($object-assign
        //             (::match:constructor@getPrototypeOf (#) )
        //             (# ("bar" 2)) )
        //     )`);
        const fn2: any = parse(`
            ($let z (# ("bar" 2)))
            (|=> (match) use (z)
                ($object-assign
                    (::match:constructor@getPrototypeOf (#) )
                    z )
            )`);
        expect(() => fn2({})).toThrow();
        expect(obj.bar).toBeUndefined();
    });
});


describe("(compile) leaking dangerous things", function() {
    // NOTE: test vulnerability (issue #1)
    it('(compile) Can\'t Function.call(untrusted code)', () => {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);

        // returns the global object

        // BUG: compiler bug occurs!
        //       Error: [SX] compileToken: First item of list is not a function:
        //              [[{"symbol":"$splice"},[{"symbol":"$call"},[{"symbol":"$get"},
        //               "match","toString","constructor"],{"symbol":"call"}]],{"symbol":"null"},"return this"].
        //
        // const rule: any = parse(`( => (match)
        //     ((::match:toString:constructor@call null "return this" ) ())
        // )`);
        const rule: any = parse(`( => (match)
            ($let z (::match:toString:constructor@call null "return this" ))
            (z ())
        )`);
        expect(() => rule({})).toThrow();
    });
    it('(compile) function\'s prototypes members', () => {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);

        // returns "[object Null]"
        const rule: any = parse(`( => (match)
            (::match:toString@call null "return this" )
        )`);
        expect(() => rule({})).toThrow();
    });
});


describe("shorthands 2", function() {
    it("shorthands 2a", function() {
        expect(lisp`
            ($defun fn () $this)
            ($let q (#
                (a 3)
                (b 5)
                (f (<- fn)) ))
            ($json-stringify (::q@f))
        `).toEqual('{"a":3,"b":5}');
    });
    it("shorthands 2b", function() {
        expect(lisp`
            ($defun fn () $this)
            ($let qq (#
                (a 3)
                (b 5)
                (f (<- fn)) ))
            ($json-stringify (::qq@f))
        `).toEqual('{"a":3,"b":5}');
    });
    it("shorthands 2c", function() {
        expect(lisp`
            ($defun fn () $this)
            ($let qqq (#
                (a 3)
                (b 5)
                (f (<- fn)) ))
            ($json-stringify (::qqq@f))
        `).toEqual('{"a":3,"b":5}');
    });
});


describe("shorthands 3", function() {
    it("shorthands 3a", function() {
        expect(lisp`
            ($let q (#
                (a 3)
                (b 5) ))
            ($eval ::q:b)
        `).toEqual(5);
    });
    it("shorthands 3b", function() {
        expect(lisp`
            ($let qq (#
                (a 3)
                (b 5) ))
            ($eval ::qq:b)
        `).toEqual(5);
    });
    it("shorthands 3c", function() {
        expect(lisp`
            ($let qqq (#
                (a 3)
                (b 5) ))
            ($eval ::qqq:b)
        `).toEqual(5);
    });
});


describe("shorthands 4", function() {
    it("shorthands 4a", function() {
        expect(lisp`
            ($let q (#
                (a 3)
                (b 5) ))
            (::q:b= 7)
            ($eval ::q:b)
        `).toEqual(7);
    });
    it("shorthands 4b", function() {
        expect(lisp`
            ($let qq (#
                (a 3)
                (b 5) ))
            (::qq:b= 7)
            ($eval ::qq:b)
        `).toEqual(7);
    });
    it("shorthands 4c", function() {
        expect(lisp`
            ($let qqq (#
                (a 3)
                (b 5) ))
            (::qqq:b= 7)
            ($eval ::qqq:b)
        `).toEqual(7);
    });
});


describe("maxEvalCount", function() {
    it('maxEvalCount 0', () => {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        config = installSequence(config);
        const parse = SExpression(config);

        const rule: any = parse(`( -> (match)
            ($for i of ($range 1 1000)
                ($let foo i) )
        )`);
        expect(() => rule({})).not.toThrow();
    });
    it('maxEvalCount 1', () => {
        let config = Object.assign({}, defaultConfig, {maxEvalCount: 1000});
        config = installCore(config);
        config = installSequence(config);
        const parse = SExpression(config);

        const rule: any = parse(`( -> (match)
            ($for i of ($range 1 1000)
                ($let foo i) )
        )`);
        expect(() => rule({})).toThrow();
    });
    it('maxEvalCount 2', () => {
        let config = Object.assign({}, defaultConfig, {maxEvalCount: 1000});
        config = installCore(config);
        config = installSequence(config);
        const parse = SExpression(config);

        const rule: any = parse(`( -> (match)
            ($for i of ($range 1 195)
                ($let foo i) )
        )`);
        expect(() => rule({})).not.toThrow();
    });
    it('maxEvalCount 3', () => {
        let config = Object.assign({}, defaultConfig, {maxEvalCount: 1000});
        config = installCore(config);
        config = installSequence(config);
        config = installArithmetic(config);
        const parse = SExpression(config);

        const rule: any = parse(`( -> (match)
            ($let n 105)
            ($let i 0)
            ($while (< i n)
                ($let i (+ i 1)) )
        )`);
        expect(() => rule({})).not.toThrow();
    });
});


describe("ReDoS protections", function() {
    it("ReDoS protections 1", function() {
        let config = Object.assign({}, defaultConfig, {enableRegExpMatchOperators: false});
        config = installCore(config);
        const parse = SExpression(config);

        expect(() => parse`
            ($match @"[a-z]+(\\d+)[a-z]+" "abc1234def")
        `).toThrow();
    });
    it("ReDoS protections 2", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);

        expect((parse`
            ($match @"[a-z]+(\\d+)[a-z]+" "abc1234def")
        ` as string[]).slice(0)).toEqual(['abc1234def', '1234']);
    });
});


describe("DoS protections (compilation)", function() {
    it("DoS protections (compilation) 1", function() {
        let config = Object.assign({}, defaultConfig, {enableCompilationOperators: false});
        config = installCore(config);
        const parse = SExpression(config);

        expect(() => parse`
            ($let foo 17)
            ($let la (=> () 3))
            ($let lb (|=> () use (foo) 5))
            ($$defun lc () 7)
            ($list (la) (lb) (lc))
        `).toThrow();
    });
    it("DoS protections (compilation) 2", function() {
        let config = Object.assign({}, defaultConfig);
        config = installCore(config);
        const parse = SExpression(config);

        expect(parse`
            ($let foo 17)
            ($let la (=> () 3))
            ($let lb (|=> () use (foo) 5))
            ($$defun lc () 7)
            ($list (la) (lb) (lc))
        `).toEqual([3, 5, 7]);
    });
});


describe("Termination of script", function() {
    it("Termination of script 1a", function() {
        expect(() => lisp`
            ($last "aaa`).toThrow();
    });
    it("Termination of script 1b", function() {
        expect(() => lisp`
            ($last "aaa
        "`).toThrow();
    });
    it("Termination of script 1c", function() {
        expect((lisp`
            ($last "aaa
        ")` as any).trim()).toEqual('aaa');
    });
    it("Termination of script 2a", function() {
        expect(() => lisp`
            """ aaa`).toThrow();
    });
    it("Termination of script 2b", function() {
        expect(() => lisp`
            """ aaa
        `).toThrow();
    });
    it("Termination of script 2c", function() {
        expect((lisp`
            """ aaa
        """` as any).trim()).toEqual('aaa');
    });
    it("Termination of script 3a", function() {
        expect(() => lisp`
            (+ 13)
            #|aaa`).toThrow();
    });
    it("Termination of script 3b", function() {
        expect(() => lisp`
            (+ 13)
            #|aaa
        `).toThrow();
    });
    it("Termination of script 3c", function() {
        expect(lisp`
            (+ 13)
            #|aaa
        |#`).toEqual(13);
    });
    it("Termination of script 4a", function() {
        expect(lisp`
            (+ 13)
            #aaa`).toEqual(13);
    });
    it("Termination of script 4b", function() {
        expect(lisp`
            (+ 13)
            #aaa
        `).toEqual(13);
    });
    it("Termination of script 5a", function() {
        expect(lisp`
            (+ 13)
            ;aaa`).toEqual(13);
    });
    it("Termination of script 5b", function() {
        expect(lisp`
            (+ 13)
            ;aaa
        `).toEqual(13);
    });
    it("Termination of script 6a", function() {
        expect(S`
            ;aaa`).toEqual({comment: 'aaa'});
    });
    it("Termination of script 6b", function() {
        expect(S`
            ;aaa
        `).toEqual({comment: 'aaa'});
    });
});
