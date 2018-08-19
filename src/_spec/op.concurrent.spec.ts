

import { S, lisp, lisp_async, LM, LM_async, LSX, LSX_async } from '../';



describe("operator.core.$let-async", function() {
    it("$raise -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($raise 11)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(11);
            }
            done();
        })();
    });
    it("$let-async -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($let-async)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$let-async a b c -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($let-async foo 0 0)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$let-async a b -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($let-async foo ${new Promise(resolve => setTimeout(resolve, 30, "17"))})
                    ($get foo)
                `).toEqual('17');
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$let-async a b -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                        ($let-async foo ${new Promise(resolve => setTimeout(resolve, 30, "17"))})
                        ($let-async bar ${new Promise(resolve => setTimeout(resolve, 30, "19"))})
                    )
                    ($list foo bar)
                `).toEqual(['17', '19']);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$let-async a b -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($let-async foo ${new Promise((resolve, reject) => setTimeout(reject, 30, "19"))})
                    ($get foo)
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(e).toEqual("19");
            }
            done();
        })();
    });
});


describe("operator.core.$set-async", function() {
    it("$set-async -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($set-async)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$set-async a b c -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($let foo -98765)($set-async foo 0 0)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$set-async a b -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($set-async foo ${new Promise(resolve => setTimeout(resolve, 30, "17"))})
                    ($get foo)
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$set-async a b -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($let foo -98765)
                    ($let bar -98764)
                    ($resolve-all
                        ($set-async foo ${new Promise(resolve => setTimeout(resolve, 30, "17"))})
                        ($set-async bar ${new Promise(resolve => setTimeout(resolve, 30, "19"))})
                    )
                    ($list foo bar)
                `).toEqual(['17', '19']);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$set-async a b -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($let foo (# (bar 3) (baz 5)))
                    ($set-async (foo bar) ${new Promise(resolve => setTimeout(resolve, 30, "17"))})
                    ($get foo)
                `).toEqual({bar: '17', baz: 5} as any);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$set-async a b -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($let foo -98765)
                    ($set-async foo ${new Promise((resolve, reject) => setTimeout(reject, 30, "19"))})
                    ($get foo)
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(e).toEqual("19");
            }
            done();
        })();
    });
});


describe("operator.core.$then", function() {
    it("foo", function() {
        expect(1).toEqual(1);
    });
    it("$then p a b -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($then ${new Promise(resolve => setTimeout(resolve, 30, 17))}
                        (-> (x) (+ x 3))
                        (-> (e) (+ e 5))
                    )
                `).toEqual(20);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$then p a -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($then ${new Promise((resolve, reject) => setTimeout(reject, 30, 17))}
                        (-> (x) (+ x 3))
                    )
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(17);
            }
            done();
        })();
    });
    it("$then p a b -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($then ${new Promise((resolve, reject) => setTimeout(reject, 30, 17))}
                        (-> (x) (+ x 3))
                        (-> (e) (+ e 5))
                    )
                `;
                expect(x).toEqual(22);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
});


describe("operator.core.$resolve-all", function() {
    it("$resolve-all -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                    )
                `).toEqual([]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-all a b c -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 5))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `).toEqual([3, 5, 7]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-all a b c -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        5
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `).toEqual([3, 5, 7]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-all a b c -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-all
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 5))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(5);
            }
            done();
        })();
    });
    it("$resolve-all a b c -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-all
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 3))}
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 5))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect([3, 5]).toContain(e);
            }
            done();
        })();
    });
});


describe("operator.core.$resolve-any", function() {
    it("$resolve-any -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-any
                    )
                `;
                expect(1).toEqual(0);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$resolve-any a b c -> resolve", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-any
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 5))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `;
                expect([3, 5, 7]).toContain(x as any);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-any a b c -> resolve", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-any
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        5
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `;
                expect([3, 5, 7]).toContain(x as any);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-any a x c -> resolve", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-any
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 5))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `;
                expect([3, 7]).toContain(x as any);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-any x x c -> resolve", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-any
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 3))}
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 5))}
                        ${new Promise(resolve => setTimeout(resolve, 30, 7))}
                    )
                `;
                expect(x).toEqual(7);
            } catch (e) {
                expect(e).toEqual(99999);
            }
            done();
        })();
    });
    it("$resolve-any a b c -> reject", function(done) {
        (async () => {
            try {
                const x = await lisp_async`
                    ($resolve-any
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 3))}
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 5))}
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 7))}
                    )
                `;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(e).toEqual([3, 5, 7]);
            }
            done();
        })();
    });
});


describe("operator.core.$resolve-pipe", function() {
    it("$resolve-pipe -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($resolve-pipe)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$resolve-pipe -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-pipe 3
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                        ${(x: any) => x + 7}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 13))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                    )
                `).toEqual(45);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-pipe -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-pipe 3
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                        15
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 13))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                    )
                `).toEqual(45);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-pipe -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-pipe
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                        ${(x: any) => x + 7}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 13))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                    )
                `).toEqual(45);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-pipe -> reject", function(done) {
        (async () => {
            try {
                const z = await lisp_async`
                    ($resolve-pipe
                        ${new Promise((resolve, reject) => setTimeout(reject, 30, 3))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                        ${(x: any) => x + 7}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 13))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                    )
                `;
                expect(z).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(3);
            }
            done();
        })();
    });
    it("$resolve-pipe -> reject", function(done) {
        (async () => {
            try {
                const z = await lisp_async`
                    ($resolve-pipe
                        ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                        ${(x: any) => x + 7}
                        ${(x: any) => new Promise((resolve, reject) => setTimeout(reject, 30, x + 13))}
                        ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                    )
                `;
                expect(z).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(28);
            }
            done();
        })();
    });
});


describe("operator.core.$resolve-fork", function() {
    it("$resolve-fork -> throw", function(done) {
        (async () => {
            try {
                const x = await lisp_async`($resolve-fork)`;
                expect(x).toEqual(99999);
            } catch (e) {
                expect(1).toEqual(1);
            }
            done();
        })();
    });
    it("$resolve-fork -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                        ...($resolve-fork ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                        )
                    )
                `).toEqual([]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-fork -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                        ...($resolve-fork 3
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                            ${(x: any) => x + 7}
                            13
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                        )
                    )
                `).toEqual([8, 10, 13, 20]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-fork -> resolve", function(done) {
        (async () => {
            try {
                expect(await lisp_async`
                    ($resolve-all
                        ...($resolve-fork ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                            ${(x: any) => x + 7}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 13))}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                        )
                    )
                `).toEqual([8, 10, 16, 20]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("$resolve-fork -> reject", function(done) {
        (async () => {
            try {
                const z = await lisp_async`
                    ($resolve-all
                        ...($resolve-fork ${new Promise((resolve, reject) => setTimeout(reject, 30, 3))}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                            ${(x: any) => x + 7}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 13))}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                        )
                    )
                `;
                expect(z).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(3);
            }
            done();
        })();
    });
    it("$resolve-fork -> reject", function(done) {
        (async () => {
            try {
                const z = await lisp_async`
                    ($resolve-all
                        ...($resolve-fork ${new Promise(resolve => setTimeout(resolve, 30, 3))}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 5))}
                            ${(x: any) => x + 7}
                            ${(x: any) => new Promise((resolve, reject) => setTimeout(reject, 30, x + 13))}
                            ${(x: any) => new Promise(resolve => setTimeout(resolve, 30, x + 17))}
                        )
                    )
                `;
                expect(z).toEqual(99999);
            } catch (e) {
                expect(e).toEqual(16);
            }
            done();
        })();
    });
});
