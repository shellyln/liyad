

import { S, lisp, LM, LSX } from '../';



describe("operator.core.<<", function() {
    it("<< -> throw", function() {
        expect(() => lisp`(<<)`).toThrow();
    });
    it("<< a -> throw", function() {
        expect(() => lisp`(<< 0)`).toThrow();
    });
    it("<< a b c -> throw", function() {
        expect(() => lisp`(<< 0 0 0)`).toThrow();
    });
    it("<< a -33 -> value", function() {
        expect(lisp`(<< -1 -33)`).toEqual(0);
    });
    it("<< a -32 -> value", function() {
        expect(lisp`(<< -1 -32)`).toEqual(0);
    });
    it("<< a -31 -> value", function() {
        expect(lisp`(<< -1 -31)`).toEqual(1);
    });
    it("<< a -30 -> value", function() {
        expect(lisp`(<< -1 -30)`).toEqual(3);
    });
    it("<< a -1 -> value", function() {
        expect(lisp`(<< -1 -1)`).toEqual(2147483647);
    });
    it("<< a 0 -> value", function() {
        expect(lisp`(<< -1 0)`).toEqual(-1);
    });
    it("<< a 1 -> value", function() {
        expect(lisp`(<< -1 1)`).toEqual(-2);
    });
    it("<< a 30 -> value", function() {
        expect(lisp`(<< -1 30)`).toEqual(-1073741824);
    });
    it("<< a 31 -> value", function() {
        expect(lisp`(<< -1 31)`).toEqual(-2147483648);
    });
    it("<< a 32 -> value", function() {
        expect(lisp`(<< -1 32)`).toEqual(0);
    });
    it("<< a 33 -> value", function() {
        expect(lisp`(<< -1 33)`).toEqual(0);
    });
    it("<< a b -> value", function() {
        expect(lisp`(<< "-1" "1")`).toEqual(-2);
    });
    it("<< a -33 -> value", function() {
        expect(lisp`(<< 4294967295 -33)`).toEqual(0);
    });
    it("<< a -32 -> value", function() {
        expect(lisp`(<< 4294967295 -32)`).toEqual(0);
    });
    it("<< a -31 -> value", function() {
        expect(lisp`(<< 4294967295 -31)`).toEqual(1);
    });
    it("<< a -30 -> value", function() {
        expect(lisp`(<< 4294967295 -30)`).toEqual(3);
    });
    it("<< a -1 -> value", function() {
        expect(lisp`(<< 4294967295 -1)`).toEqual(2147483647);
    });
    it("<< a 0 -> value", function() {
        expect(lisp`(<< 4294967295 0)`).toEqual(-1);
    });
    it("<< a 1 -> value", function() {
        expect(lisp`(<< 4294967295 1)`).toEqual(-2);
    });
    it("<< a 30 -> value", function() {
        expect(lisp`(<< 4294967295 30)`).toEqual(-1073741824);
    });
    it("<< a 31 -> value", function() {
        expect(lisp`(<< 4294967295 31)`).toEqual(-2147483648);
    });
    it("<< a 32 -> value", function() {
        expect(lisp`(<< 4294967295 32)`).toEqual(0);
    });
    it("<< a 33 -> value", function() {
        expect(lisp`(<< 4294967295 33)`).toEqual(0);
    });
    it("<< a -33 -> value", function() {
        expect(lisp`(<< 2147483647 -33)`).toEqual(0);
    });
    it("<< a -32 -> value", function() {
        expect(lisp`(<< 2147483647 -32)`).toEqual(0);
    });
    it("<< a -31 -> value", function() {
        expect(lisp`(<< 2147483647 -31)`).toEqual(0);
    });
    it("<< a -30 -> value", function() {
        expect(lisp`(<< 2147483647 -30)`).toEqual(1);
    });
    it("<< a -1 -> value", function() {
        expect(lisp`(<< 2147483647 -1)`).toEqual(1073741823);
    });
    it("<< a 0 -> value", function() {
        expect(lisp`(<< 2147483647 0)`).toEqual(2147483647);
    });
    it("<< a 1 -> value", function() {
        expect(lisp`(<< 2147483647 1)`).toEqual(-2);
    });
    it("<< a 30 -> value", function() {
        expect(lisp`(<< 2147483647 30)`).toEqual(-1073741824);
    });
    it("<< a 31 -> value", function() {
        expect(lisp`(<< 2147483647 31)`).toEqual(-2147483648);
    });
    it("<< a 32 -> value", function() {
        expect(lisp`(<< 2147483647 32)`).toEqual(0);
    });
    it("<< a 33 -> value", function() {
        expect(lisp`(<< 2147483647 33)`).toEqual(0);
    });
    it("<< a 0 -> value", function() {
        expect(lisp`(<< 8589934591 0)`).toEqual(-1);
    });
});


describe("operator.core.>>", function() {
    it(">> -> throw", function() {
        expect(() => lisp`(>>)`).toThrow();
    });
    it(">> a -> throw", function() {
        expect(() => lisp`(>> 0)`).toThrow();
    });
    it(">> a b c -> throw", function() {
        expect(() => lisp`(>> 0 0 0)`).toThrow();
    });
    it(">> a -33 -> value", function() {
        expect(lisp`(>> -1 -33)`).toEqual(0);
    });
    it(">> a -32 -> value", function() {
        expect(lisp`(>> -1 -32)`).toEqual(0);
    });
    it(">> a -31 -> value", function() {
        expect(lisp`(>> -1 -31)`).toEqual(-2147483648);
    });
    it(">> a -30 -> value", function() {
        expect(lisp`(>> -1 -30)`).toEqual(-1073741824);
    });
    it(">> a -1 -> value", function() {
        expect(lisp`(>> -1 -1)`).toEqual(-2);
    });
    it(">> a 0 -> value", function() {
        expect(lisp`(>> -1 0)`).toEqual(-1);
    });
    it(">> a 1 -> value", function() {
        expect(lisp`(>> -1 1)`).toEqual(-1);
    });
    it(">> a 30 -> value", function() {
        expect(lisp`(>> -1 30)`).toEqual(-1);
    });
    it(">> a 31 -> value", function() {
        expect(lisp`(>> -1 31)`).toEqual(-1);
    });
    it(">> a 32 -> value", function() {
        expect(lisp`(>> -1 32)`).toEqual(-1);
    });
    it(">> a 33 -> value", function() {
        expect(lisp`(>> -1 33)`).toEqual(-1);
    });
    it(">> a b -> value", function() {
        expect(lisp`(>> "-1" "1")`).toEqual(-1);
    });
    it(">> a -33 -> value", function() {
        expect(lisp`(>> 4294967295 -33)`).toEqual(0);
    });
    it(">> a -32 -> value", function() {
        expect(lisp`(>> 4294967295 -32)`).toEqual(0);
    });
    it(">> a -31 -> value", function() {
        expect(lisp`(>> 4294967295 -31)`).toEqual(-2147483648);
    });
    it(">> a -30 -> value", function() {
        expect(lisp`(>> 4294967295 -30)`).toEqual(-1073741824);
    });
    it(">> a -1 -> value", function() {
        expect(lisp`(>> 4294967295 -1)`).toEqual(-2);
    });
    it(">> a 0 -> value", function() {
        expect(lisp`(>> 4294967295 0)`).toEqual(-1);
    });
    it(">> a 1 -> value", function() {
        expect(lisp`(>> 4294967295 1)`).toEqual(-1);
    });
    it(">> a 30 -> value", function() {
        expect(lisp`(>> 4294967295 30)`).toEqual(-1);
    });
    it(">> a 31 -> value", function() {
        expect(lisp`(>> 4294967295 31)`).toEqual(-1);
    });
    it(">> a 32 -> value", function() {
        expect(lisp`(>> 4294967295 32)`).toEqual(-1);
    });
    it(">> a 33 -> value", function() {
        expect(lisp`(>> 4294967295 33)`).toEqual(-1);
    });
    it(">> a -33 -> value", function() {
        expect(lisp`(>> 2147483647 -33)`).toEqual(0);
    });
    it(">> a -32 -> value", function() {
        expect(lisp`(>> 2147483647 -32)`).toEqual(0);
    });
    it(">> a -31 -> value", function() {
        expect(lisp`(>> 2147483647 -31)`).toEqual(-2147483648);
    });
    it(">> a -30 -> value", function() {
        expect(lisp`(>> 2147483647 -30)`).toEqual(-1073741824);
    });
    it(">> a -1 -> value", function() {
        expect(lisp`(>> 2147483647 -1)`).toEqual(-2);
    });
    it(">> a 0 -> value", function() {
        expect(lisp`(>> 2147483647 0)`).toEqual(2147483647);
    });
    it(">> a 1 -> value", function() {
        expect(lisp`(>> 2147483647 1)`).toEqual(1073741823);
    });
    it(">> a 30 -> value", function() {
        expect(lisp`(>> 2147483647 30)`).toEqual(1);
    });
    it(">> a 31 -> value", function() {
        expect(lisp`(>> 2147483647 31)`).toEqual(0);
    });
    it(">> a 32 -> value", function() {
        expect(lisp`(>> 2147483647 32)`).toEqual(0);
    });
    it(">> a 33 -> value", function() {
        expect(lisp`(>> 2147483647 33)`).toEqual(0);
    });
    it(">> a 0 -> value", function() {
        expect(lisp`(>> 8589934591 0)`).toEqual(-1);
    });
});


describe("operator.core.>>>", function() {
    it(">>> -> throw", function() {
        expect(() => lisp`(>>>)`).toThrow();
    });
    it(">>> a -> throw", function() {
        expect(() => lisp`(>>> 0)`).toThrow();
    });
    it(">>> a b c -> throw", function() {
        expect(() => lisp`(>>> 0 0 0)`).toThrow();
    });
    it(">>> a -33 -> value", function() {
        expect(lisp`(>>> -1 -33)`).toEqual(0);
    });
    it(">>> a -32 -> value", function() {
        expect(lisp`(>>> -1 -32)`).toEqual(0);
    });
    it(">>> a -31 -> value", function() {
        expect(lisp`(>>> -1 -31)`).toEqual(-2147483648);
    });
    it(">>> a -30 -> value", function() {
        expect(lisp`(>>> -1 -30)`).toEqual(-1073741824);
    });
    it(">>> a -1 -> value", function() {
        expect(lisp`(>>> -1 -1)`).toEqual(-2);
    });
    it(">>> a 0 -> value", function() {
        expect(lisp`(>>> -1 0)`).toEqual(4294967295); // TODO:
    });
    it(">>> a 1 -> value", function() {
        expect(lisp`(>>> -1 1)`).toEqual(2147483647);
    });
    it(">>> a 30 -> value", function() {
        expect(lisp`(>>> -1 30)`).toEqual(3);
    });
    it(">>> a 31 -> value", function() {
        expect(lisp`(>>> -1 31)`).toEqual(1);
    });
    it(">>> a 32 -> value", function() {
        expect(lisp`(>>> -1 32)`).toEqual(0);
    });
    it(">>> a 33 -> value", function() {
        expect(lisp`(>>> -1 33)`).toEqual(0);
    });
    it(">>> a b -> value", function() {
        expect(lisp`(>>> "-1" "1")`).toEqual(2147483647);
    });
    it(">>> a -33 -> value", function() {
        expect(lisp`(>>> 4294967295 -33)`).toEqual(0);
    });
    it(">>> a -32 -> value", function() {
        expect(lisp`(>>> 4294967295 -32)`).toEqual(0);
    });
    it(">>> a -31 -> value", function() {
        expect(lisp`(>>> 4294967295 -31)`).toEqual(-2147483648);
    });
    it(">>> a -30 -> value", function() {
        expect(lisp`(>>> 4294967295 -30)`).toEqual(-1073741824);
    });
    it(">>> a -1 -> value", function() {
        expect(lisp`(>>> 4294967295 -1)`).toEqual(-2);
    });
    it(">>> a 0 -> value", function() {
        expect(lisp`(>>> 4294967295 0)`).toEqual(4294967295); // TODO:
    });
    it(">>> a 1 -> value", function() {
        expect(lisp`(>>> 4294967295 1)`).toEqual(2147483647);
    });
    it(">>> a 30 -> value", function() {
        expect(lisp`(>>> 4294967295 30)`).toEqual(3);
    });
    it(">>> a 31 -> value", function() {
        expect(lisp`(>>> 4294967295 31)`).toEqual(1);
    });
    it(">>> a 32 -> value", function() {
        expect(lisp`(>>> 4294967295 32)`).toEqual(0);
    });
    it(">>> a 33 -> value", function() {
        expect(lisp`(>>> 4294967295 33)`).toEqual(0);
    });
    it(">>> a -33 -> value", function() {
        expect(lisp`(>>> 2147483647 -33)`).toEqual(0);
    });
    it(">>> a -32 -> value", function() {
        expect(lisp`(>>> 2147483647 -32)`).toEqual(0);
    });
    it(">>> a -31 -> value", function() {
        expect(lisp`(>>> 2147483647 -31)`).toEqual(-2147483648);
    });
    it(">>> a -30 -> value", function() {
        expect(lisp`(>>> 2147483647 -30)`).toEqual(-1073741824);
    });
    it(">>> a -1 -> value", function() {
        expect(lisp`(>>> 2147483647 -1)`).toEqual(-2);
    });
    it(">>> a 0 -> value", function() {
        expect(lisp`(>>> 2147483647 0)`).toEqual(2147483647);
    });
    it(">>> a 1 -> value", function() {
        expect(lisp`(>>> 2147483647 1)`).toEqual(1073741823);
    });
    it(">>> a 30 -> value", function() {
        expect(lisp`(>>> 2147483647 30)`).toEqual(1);
    });
    it(">>> a 31 -> value", function() {
        expect(lisp`(>>> 2147483647 31)`).toEqual(0);
    });
    it(">>> a 32 -> value", function() {
        expect(lisp`(>>> 2147483647 32)`).toEqual(0);
    });
    it(">>> a 33 -> value", function() {
        expect(lisp`(>>> 2147483647 33)`).toEqual(0);
    });
    it(">>> a 0 -> value", function() {
        expect(lisp`(>>> 8589934591 0)`).toEqual(4294967295); // TODO:
    });
});


describe("operator.core.$bit-not", function() {
    it("$bit-not -> throw", function() {
        expect(() => lisp`($bit-not)`).toThrow();
    });
    it("$bit-not a b -> throw", function() {
        expect(() => lisp`($bit-not 0 0)`).toThrow();
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not 2147483647)`).toEqual(-2147483648);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not 1)`).toEqual(-2);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not 0)`).toEqual(-1);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not -1)`).toEqual(0);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not 4294967295)`).toEqual(0);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not -2)`).toEqual(1);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not 4294967294)`).toEqual(1);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not -2147483648)`).toEqual(2147483647);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not 2147483648)`).toEqual(2147483647);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not "0")`).toEqual(-1);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not "-1")`).toEqual(0);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not true)`).toEqual(-2);
    });
    it("$bit-not a -> value", function() {
        expect(lisp`($bit-not false)`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not NaN)`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not +Infinity)`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not -Infinity)`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not null)`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not nil)`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not '(1))`).toEqual(-1);
    });
    it("$bit-not a -> -1", function() {
        expect(lisp`($bit-not "a")`).toEqual(-1);
    });
});


describe("operator.core.$bit-and", function() {
    it("$bit-and -> throw", function() {
        expect(() => lisp`($bit-and)`).toThrow();
    });
    it("$bit-and a -> throw", function() {
        expect(() => lisp`($bit-and 0)`).toThrow();
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and 0 0)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 0)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and 0 -1)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1)`).toEqual(-1);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and 0 0 0)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 0 0)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and 0 0 -1)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 0 -1)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 -1)`).toEqual(-1);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and "-1" "-1" "-1")`).toEqual(-1);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 +Infinity)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 true)`).toEqual(1);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 false)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 NaN)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 undefined)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 null)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 nil)`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 '(3))`).toEqual(0);
    });
    it("$bit-and a b -> number", function() {
        expect(lisp`($bit-and -1 -1 "a")`).toEqual(0);
    });
});


describe("operator.core.$bit-or", function() {
    it("$bit-or -> throw", function() {
        expect(() => lisp`($bit-or)`).toThrow();
    });
    it("$bit-or a -> throw", function() {
        expect(() => lisp`($bit-or 0)`).toThrow();
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or -1 0)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 -1)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or -1 -1)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 0)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or -1 0 0)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 -1)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or -1 0 -1)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or -1 -1 -1)`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or "-1" "-1" "-1")`).toEqual(-1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 +Infinity)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 true)`).toEqual(1);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 false)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 NaN)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 undefined)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 null)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 nil)`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 '(3))`).toEqual(0);
    });
    it("$bit-or a b -> number", function() {
        expect(lisp`($bit-or 0 0 "a")`).toEqual(0);
    });
});


describe("operator.core.$bit-xor", function() {
    it("$bit-xor -> throw", function() {
        expect(() => lisp`($bit-xor)`).toThrow();
    });
    it("$bit-xor a -> throw", function() {
        expect(() => lisp`($bit-xor 0)`).toThrow();
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor 0 0)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 0)`).toEqual(-1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor 0 -1)`).toEqual(-1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor 0 0 0)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 0 0)`).toEqual(-1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor 0 0 -1)`).toEqual(-1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 0 -1)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 -1)`).toEqual(-1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor "-1" "-1" "-1")`).toEqual(-1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 +Infinity)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 true)`).toEqual(1);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 false)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 NaN)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 undefined)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 null)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 nil)`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 '(3))`).toEqual(0);
    });
    it("$bit-xor a b -> number", function() {
        expect(lisp`($bit-xor -1 -1 "a")`).toEqual(0);
    });
});


describe("operator.core.+", function() {
    it("+ -> throw", function() {
        expect(() => lisp`(+)`).toThrow();
    });
    it("+ a -> number", function() {
        expect(lisp`(+ 3)`).toEqual(3);
    });
    it("+ a b -> number", function() {
        expect(lisp`(+ 3 5)`).toEqual(8);
    });
    it("+ a b c -> number", function() {
        expect(lisp`(+ 3 5 7)`).toEqual(15);
    });
    it("+ a b c -> number", function() {
        expect(lisp`(+ "3" "5" "7")`).toEqual(15);
    });
    it("+ a b c -> number", function() {
        expect(lisp`(+ -3 -5 -7)`).toEqual(-15);
    });
    it("+ a b -> Infinity", function() {
        expect(lisp`(+ +Infinity 5)`).toEqual(+Infinity);
    });
    it("+ a b -> Infinity", function() {
        expect(lisp`(+ 5 +Infinity)`).toEqual(+Infinity);
    });
    it("+ a b -> Infinity", function() {
        expect(lisp`(+ -Infinity 5)`).toEqual(-Infinity);
    });
    it("+ a b -> Infinity", function() {
        expect(lisp`(+ 5 -Infinity)`).toEqual(-Infinity);
    });
    it("+ a b c -> NaN", function() {
        expect(lisp`(+ "3" "5" "a")`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ NaN 5)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ 5 NaN)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ undefined 5)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ 5 undefined)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ null 5)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ 5 null)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ nil 5)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ 5 nil)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ () 5)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ 5 ())`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ '(3) 5)`).toEqual(NaN);
    });
    it("+ a b -> NaN", function() {
        expect(lisp`(+ 5 '(3))`).toEqual(NaN);
    });
});


describe("operator.core.-", function() {
    it("- -> throw", function() {
        expect(() => lisp`(-)`).toThrow();
    });
    it("- a -> number", function() {
        expect(lisp`(- 3)`).toEqual(-3);
    });
    it("- a b -> number", function() {
        expect(lisp`(- 3 5)`).toEqual(-2);
    });
    it("- a b c -> number", function() {
        expect(lisp`(- 3 5 7)`).toEqual(-9);
    });
    it("- a b c -> number", function() {
        expect(lisp`(- "3" "5" "7")`).toEqual(-9);
    });
    it("- a b c -> number", function() {
        expect(lisp`(- -3 -5 -7)`).toEqual(9);
    });
    it("- a b -> Infinity", function() {
        expect(lisp`(- +Infinity 5)`).toEqual(+Infinity);
    });
    it("- a b -> Infinity", function() {
        expect(lisp`(- 5 +Infinity)`).toEqual(-Infinity);
    });
    it("- a b -> Infinity", function() {
        expect(lisp`(- -Infinity 5)`).toEqual(-Infinity);
    });
    it("- a b -> Infinity", function() {
        expect(lisp`(- 5 -Infinity)`).toEqual(+Infinity);
    });
    it("- a b c -> NaN", function() {
        expect(lisp`(- "3" "5" "a")`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- NaN 5)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- 5 NaN)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- undefined 5)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- 5 undefined)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- null 5)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- 5 null)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- nil 5)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- 5 nil)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- () 5)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- 5 ())`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- '(3) 5)`).toEqual(NaN);
    });
    it("- a b -> NaN", function() {
        expect(lisp`(- 5 '(3))`).toEqual(NaN);
    });
});


describe("operator.core.*", function() {
    it("* -> throw", function() {
        expect(() => lisp`(*)`).toThrow();
    });
    it("* a -> throw", function() {
        expect(() => lisp`(* 3)`).toThrow();
    });
    it("* a b -> number", function() {
        expect(lisp`(* 3 5)`).toEqual(15);
    });
    it("* a b c -> number", function() {
        expect(lisp`(* 3 5 7)`).toEqual(3 * 5 * 7);
    });
    it("* a b c -> number", function() {
        expect(lisp`(* "3" "5" "7")`).toEqual(3 * 5 * 7);
    });
    it("* a b c -> number", function() {
        expect(lisp`(* -3 -5 -7)`).toEqual(-3 * -5 * -7);
    });
    it("* a b -> Infinity", function() {
        expect(lisp`(* +Infinity 5)`).toEqual(+Infinity);
    });
    it("* a b -> Infinity", function() {
        expect(lisp`(* 5 +Infinity)`).toEqual(+Infinity);
    });
    it("* a b -> Infinity", function() {
        expect(lisp`(* -Infinity 5)`).toEqual(-Infinity);
    });
    it("* a b -> Infinity", function() {
        expect(lisp`(* 5 -Infinity)`).toEqual(-Infinity);
    });
    it("* a b c -> NaN", function() {
        expect(lisp`(* "3" "5" "a")`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* NaN 5)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* 5 NaN)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* undefined 5)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* 5 undefined)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* null 5)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* 5 null)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* nil 5)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* 5 nil)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* () 5)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* 5 ())`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* '(3) 5)`).toEqual(NaN);
    });
    it("* a b -> NaN", function() {
        expect(lisp`(* 5 '(3))`).toEqual(NaN);
    });
});


describe("operator.core.**", function() {
    it("** -> throw", function() {
        expect(() => lisp`(**)`).toThrow();
    });
    it("** a -> number", function() {
        expect(() => lisp`(** 3)`).toThrow();
    });
    it("** a b -> number", function() {
        expect(lisp`(** 3 5)`).toEqual(3 ** 5);
    });
    it("** a b c -> number", function() {
        expect(lisp`(** 3 5 7)`).toEqual((3 ** 5) ** 7);
    });
    it("** a b c -> number", function() {
        expect(lisp`(** "3" "5" "7")`).toEqual((3 ** 5) ** 7);
    });
    it("** a b c -> number", function() {
        expect(lisp`(** -3 -5 -7)`).toEqual(((-3) ** (-5)) ** (-7));
    });
    it("** a b -> Infinity", function() {
        expect(lisp`(** +Infinity 5)`).toEqual(+Infinity);
    });
    it("** a b -> Infinity", function() {
        expect(lisp`(** 5 +Infinity)`).toEqual(+Infinity);
    });
    it("** a b -> Infinity", function() {
        expect(lisp`(** -Infinity 5)`).toEqual(-Infinity);
    });
    it("** a b -> Infinity", function() {
        expect(lisp`(** 5 -Infinity)`).toEqual(0);
    });
    it("** a b c -> NaN", function() {
        expect(lisp`(** "3" "5" "a")`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** NaN 5)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** 5 NaN)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** undefined 5)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** 5 undefined)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** null 5)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** 5 null)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** nil 5)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** 5 nil)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** () 5)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** 5 ())`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** '(3) 5)`).toEqual(NaN);
    });
    it("** a b -> NaN", function() {
        expect(lisp`(** 5 '(3))`).toEqual(NaN);
    });
});


describe("operator.core./", function() {
    it("/ -> throw", function() {
        expect(() => lisp`(/)`).toThrow();
    });
    it("/ a -> number", function() {
        expect(() => lisp`(/ 3)`).toThrow();
    });
    it("/ a b -> number", function() {
        expect(lisp`(/ 3 5)`).toEqual(3 / 5);
    });
    it("/ a b c -> number", function() {
        expect(lisp`(/ 3 5 7)`).toEqual((3 / 5) / 7);
    });
    it("/ a b c -> number", function() {
        expect(lisp`(/ "3" "5" "7")`).toEqual((3 / 5) / 7);
    });
    it("/ a b c -> number", function() {
        expect(lisp`(/ -3 -5 -7)`).toEqual((-3 / -5) / -7);
    });
    it("/ a b -> Infinity", function() {
        expect(lisp`(/ +Infinity 5)`).toEqual(+Infinity);
    });
    it("/ a b -> number", function() {
        expect(lisp`(/ 5 +Infinity)`).toEqual(+0);
    });
    it("/ a b -> Infinity", function() {
        expect(lisp`(/ -Infinity 5)`).toEqual(-Infinity);
    });
    it("/ a b -> number", function() {
        expect(lisp`(/ 5 -Infinity)`).toEqual(-0);
    });
    it("/ a b c -> NaN", function() {
        expect(lisp`(/ "3" "5" "a")`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ NaN 5)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 5 NaN)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ undefined 5)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 5 undefined)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ null 5)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 5 null)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ nil 5)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 5 nil)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ () 5)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 5 ())`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ '(3) 5)`).toEqual(NaN);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 5 '(3))`).toEqual(NaN);
    });
    it("/ a b -> Infinity", function() {
        expect(lisp`(/ 1 0)`).toEqual(Infinity);
    });
    it("/ a b -> -Infinity", function() {
        expect(lisp`(/ 1 -0)`).toEqual(-Infinity);
    });
    it("/ a b -> -Infinity", function() {
        expect(lisp`(/ -1 0)`).toEqual(-Infinity);
    });
    it("/ a b -> Infinity", function() {
        expect(lisp`(/ -1 -0)`).toEqual(Infinity);
    });
    it("/ a b -> NaN", function() {
        expect(lisp`(/ 0 0)`).toEqual(NaN);
    });
});


describe("operator.core.%", function() {
    it("% -> throw", function() {
        expect(() => lisp`(%)`).toThrow();
    });
    it("% a -> number", function() {
        expect(() => lisp`(% 3)`).toThrow();
    });
    it("% a b -> number", function() {
        expect(lisp`(% 3 5)`).toEqual(3 % 5);
    });
    it("% a b c -> number", function() {
        expect(lisp`(% 13 7 5)`).toEqual((13 % 7) % 5);
    });
    it("% a b c -> number", function() {
        expect(lisp`(% "13" "7" "5")`).toEqual((13 % 7) % 5);
    });
    it("% a b c -> number", function() {
        expect(lisp`(% -13 -7 -5)`).toEqual((-13 % -7) % -5);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% +Infinity 5)`).toEqual(NaN);
    });
    it("% a b -> number", function() {
        expect(lisp`(% 5 +Infinity)`).toEqual(5);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% -Infinity 5)`).toEqual(NaN);
    });
    it("% a b -> number", function() {
        expect(lisp`(% 5 -Infinity)`).toEqual(5);
    });
    it("% a b c -> NaN", function() {
        expect(lisp`(% "3" "5" "a")`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% NaN 5)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% 5 NaN)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% undefined 5)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% 5 undefined)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% null 5)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% 5 null)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% nil 5)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% 5 nil)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% () 5)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% 5 ())`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% '(3) 5)`).toEqual(NaN);
    });
    it("% a b -> NaN", function() {
        expect(lisp`(% 5 '(3))`).toEqual(NaN);
    });
});


describe("operator.core.$max", function() {
    it("$max -> -Infinity", function() {
        expect(lisp`($max)`).toEqual(-Infinity);
    });
    it("$max a -> value", function() {
        expect(lisp`($max 3)`).toEqual(3);
    });
    it("$max a b -> value", function() {
        expect(lisp`($max 5 3)`).toEqual(5);
    });
    it("$max a b c -> value", function() {
        expect(lisp`($max 5 3 7)`).toEqual(7);
    });
    it("$max a b c -> value", function() {
        expect(lisp`($max 5 3 (+ 7 11))`).toEqual(18);
    });
    it("$max a b c -> value", function() {
        expect(lisp`($max ...'(5 3 7))`).toEqual(7);
    });
    it("$max a b c -> value", function() {
        expect(lisp`($max "5" "3" "7")`).toEqual(7);
    });
    it("$max a b c -> value", function() {
        expect(lisp`($max 5 3 null)`).toEqual(NaN);
    });
    it("$max +Infinity -> +Infinity", function() {
        expect(lisp`($max +Infinity)`).toEqual(+Infinity);
    });
    it("$max -Infinity -> -Infinity", function() {
        expect(lisp`($max -Infinity)`).toEqual(-Infinity);
    });
    it("$max NaN -> NaN", function() {
        expect(lisp`($max NaN)`).toEqual(NaN);
    });
    it("$max true -> 1", function() {
        expect(lisp`($max true)`).toEqual(1);
    });
    it("$max false -> 0", function() {
        expect(lisp`($max false)`).toEqual(0);
    });
    it("$max undefined -> NaN", function() {
        expect(lisp`($max undefined)`).toEqual(NaN);
    });
    it("$max null -> NaN", function() {
        expect(lisp`($max null)`).toEqual(NaN);
    });
    it("$max nil -> NaN", function() {
        expect(lisp`($max nil)`).toEqual(NaN);
    });
    it("$max () -> NaN", function() {
        expect(lisp`($max ())`).toEqual(NaN);
    });
    it("$max (a) -> NaN", function() {
        expect(lisp`($max '(5))`).toEqual(NaN);
    });
});


describe("operator.core.$min", function() {
    it("$min -> -Infinity", function() {
        expect(lisp`($min)`).toEqual(Infinity);
    });
    it("$min a -> value", function() {
        expect(lisp`($min 3)`).toEqual(3);
    });
    it("$min a b -> value", function() {
        expect(lisp`($min 5 3)`).toEqual(3);
    });
    it("$min a b c -> value", function() {
        expect(lisp`($min 5 3 7)`).toEqual(3);
    });
    it("$min a b c -> value", function() {
        expect(lisp`($min 5 3 (- 7 11))`).toEqual(-4);
    });
    it("$min a b c -> value", function() {
        expect(lisp`($min ...'(5 3 7))`).toEqual(3);
    });
    it("$min a b c -> value", function() {
        expect(lisp`($min "5" "3" "7")`).toEqual(3);
    });
    it("$min a b c -> value", function() {
        expect(lisp`($min 5 3 null)`).toEqual(NaN);
    });
    it("$min +Infinity -> +Infinity", function() {
        expect(lisp`($min +Infinity)`).toEqual(+Infinity);
    });
    it("$min -Infinity -> -Infinity", function() {
        expect(lisp`($min -Infinity)`).toEqual(-Infinity);
    });
    it("$min NaN -> NaN", function() {
        expect(lisp`($min NaN)`).toEqual(NaN);
    });
    it("$min true -> 1", function() {
        expect(lisp`($min true)`).toEqual(1);
    });
    it("$min false -> 0", function() {
        expect(lisp`($min false)`).toEqual(0);
    });
    it("$min undefined -> NaN", function() {
        expect(lisp`($min undefined)`).toEqual(NaN);
    });
    it("$min null -> NaN", function() {
        expect(lisp`($min null)`).toEqual(NaN);
    });
    it("$min nil -> NaN", function() {
        expect(lisp`($min nil)`).toEqual(NaN);
    });
    it("$min () -> NaN", function() {
        expect(lisp`($min ())`).toEqual(NaN);
    });
    it("$min (a) -> NaN", function() {
        expect(lisp`($min '(5))`).toEqual(NaN);
    });
});


describe("operator.core.$avg", function() {
    it("$avg -> NaN", function() {
        expect(lisp`($avg)`).toEqual(NaN);
    });
    it("$avg a -> a", function() {
        expect(lisp`($avg 3)`).toEqual(3);
    });
    it("$avg a b -> value", function() {
        expect(lisp`($avg 3 5)`).toEqual(4);
    });
    it("$avg a b c -> value", function() {
        expect(lisp`($avg 3 5 7)`).toEqual(5);
    });
    it("$avg a b c -> value", function() {
        expect(lisp`($avg "3" "5" "7")`).toEqual(5);
    });
    it("$avg a b c -> value", function() {
        expect(lisp`($avg 3 5 (+ 1 6))`).toEqual(5);
    });
    it("$avg a b c -> value", function() {
        expect(lisp`($avg ...'(3 5 7))`).toEqual(5);
    });
    it("$avg a b null -> NaN", function() {
        expect(lisp`($avg 3 5 null)`).toEqual(NaN);
    });
    it("$avg +Infinity -> +Infinity", function() {
        expect(lisp`($avg +Infinity)`).toEqual(+Infinity);
    });
    it("$avg -Infinity -> -Infinity", function() {
        expect(lisp`($avg -Infinity)`).toEqual(-Infinity);
    });
    it("$avg NaN -> NaN", function() {
        expect(lisp`($avg NaN)`).toEqual(NaN);
    });
    it("$avg true -> 1", function() {
        expect(lisp`($avg true)`).toEqual(1);
    });
    it("$avg false -> 0", function() {
        expect(lisp`($avg false)`).toEqual(0);
    });
    it("$avg undefined -> NaN", function() {
        expect(lisp`($avg undefined)`).toEqual(NaN);
    });
    it("$avg null -> NaN", function() {
        expect(lisp`($avg null)`).toEqual(NaN);
    });
    it("$avg nil -> NaN", function() {
        expect(lisp`($avg nil)`).toEqual(NaN);
    });
    it("$avg () -> NaN", function() {
        expect(lisp`($avg ())`).toEqual(NaN);
    });
    it("$avg (a) -> NaN", function() {
        expect(lisp`($avg '(5))`).toEqual(NaN);
    });
});


describe("operator.core.$floor", function() {
    it("$floor -> throw", function() {
        expect(() => lisp`($floor)`).toThrow();
    });
    it("$floor a b -> throw", function() {
        expect(() => lisp`($floor 0 0)`).toThrow();
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 0)`).toEqual(0);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 3)`).toEqual(3);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -3)`).toEqual(-3);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 3.1)`).toEqual(3);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -3.1)`).toEqual(-4);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 3.9)`).toEqual(3);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -3.9)`).toEqual(-4);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -4.5)`).toEqual(-5);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -3.5)`).toEqual(-4);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -2.5)`).toEqual(-3);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -1.5)`).toEqual(-2);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor -0.5)`).toEqual(-1);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 0.5)`).toEqual(0);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 1.5)`).toEqual(1);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 2.5)`).toEqual(2);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor 3.5)`).toEqual(3);
    });
    it("$floor +Infinity -> +Infinity", function() {
        expect(lisp`($floor +Infinity)`).toEqual(+Infinity);
    });
    it("$floor -Infinity -> -Infinity", function() {
        expect(lisp`($floor -Infinity)`).toEqual(-Infinity);
    });
    it("$floor NaN -> NaN", function() {
        expect(lisp`($floor NaN)`).toEqual(NaN);
    });
    it("$floor true -> 1", function() {
        expect(lisp`($floor true)`).toEqual(1);
    });
    it("$floor false -> 0", function() {
        expect(lisp`($floor false)`).toEqual(0);
    });
    it("$floor undefined -> NaN", function() {
        expect(lisp`($floor undefined)`).toEqual(NaN);
    });
    it("$floor null -> NaN", function() {
        expect(lisp`($floor null)`).toEqual(NaN);
    });
    it("$floor nil -> NaN", function() {
        expect(lisp`($floor nil)`).toEqual(NaN);
    });
    it("$floor () -> NaN", function() {
        expect(lisp`($floor ())`).toEqual(NaN);
    });
    it("$floor (a) -> NaN", function() {
        expect(lisp`($floor '(5))`).toEqual(NaN);
    });
    it("$floor a -> value", function() {
        expect(lisp`($floor "0")`).toEqual(0);
    });
    it("$floor a -> NaN", function() {
        expect(lisp`($floor "a")`).toEqual(NaN);
    });
});


describe("operator.core.$ceil", function() {
    it("$ceil -> throw", function() {
        expect(() => lisp`($ceil)`).toThrow();
    });
    it("$ceil a b -> throw", function() {
        expect(() => lisp`($ceil 0 0)`).toThrow();
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 0)`).toEqual(0);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 3)`).toEqual(3);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -3)`).toEqual(-3);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 3.1)`).toEqual(4);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -3.1)`).toEqual(-3);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 3.9)`).toEqual(4);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -3.9)`).toEqual(-3);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -4.5)`).toEqual(-4);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -3.5)`).toEqual(-3);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -2.5)`).toEqual(-2);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -1.5)`).toEqual(-1);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil -0.5)`).toEqual(-0);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 0.5)`).toEqual(1);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 1.5)`).toEqual(2);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 2.5)`).toEqual(3);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil 3.5)`).toEqual(4);
    });
    it("$ceil +Infinity -> +Infinity", function() {
        expect(lisp`($ceil +Infinity)`).toEqual(+Infinity);
    });
    it("$ceil -Infinity -> -Infinity", function() {
        expect(lisp`($ceil -Infinity)`).toEqual(-Infinity);
    });
    it("$ceil NaN -> NaN", function() {
        expect(lisp`($ceil NaN)`).toEqual(NaN);
    });
    it("$ceil true -> 1", function() {
        expect(lisp`($ceil true)`).toEqual(1);
    });
    it("$ceil false -> 0", function() {
        expect(lisp`($ceil false)`).toEqual(0);
    });
    it("$ceil undefined -> NaN", function() {
        expect(lisp`($ceil undefined)`).toEqual(NaN);
    });
    it("$ceil null -> NaN", function() {
        expect(lisp`($ceil null)`).toEqual(NaN);
    });
    it("$ceil nil -> NaN", function() {
        expect(lisp`($ceil nil)`).toEqual(NaN);
    });
    it("$ceil () -> NaN", function() {
        expect(lisp`($ceil ())`).toEqual(NaN);
    });
    it("$ceil (a) -> NaN", function() {
        expect(lisp`($ceil '(5))`).toEqual(NaN);
    });
    it("$ceil a -> value", function() {
        expect(lisp`($ceil "0")`).toEqual(0);
    });
    it("$ceil a -> NaN", function() {
        expect(lisp`($ceil "a")`).toEqual(NaN);
    });
});


describe("operator.core.$round", function() {
    it("$round -> throw", function() {
        expect(() => lisp`($round)`).toThrow();
    });
    it("$round a b -> throw", function() {
        expect(() => lisp`($round 0 0)`).toThrow();
    });
    it("$round a -> value", function() {
        expect(lisp`($round 0)`).toEqual(0);
    });
    it("$round a -> value", function() {
        expect(lisp`($round 3)`).toEqual(3);
    });
    it("$round a -> value", function() {
        expect(lisp`($round -3)`).toEqual(-3);
    });
    it("$round a -> value", function() {
        expect(lisp`($round 3.1)`).toEqual(3);
    });
    it("$round a -> value", function() {
        expect(lisp`($round -3.1)`).toEqual(-3);
    });
    it("$round a -> value", function() {
        expect(lisp`($round 3.9)`).toEqual(4);
    });
    it("$round a -> value", function() {
        expect(lisp`($round -3.9)`).toEqual(-4);
    });
    it("$round a -> value", function() {
        expect(lisp`($round -4.5)`).toEqual(-4);
    });
    it("$round a -> value", function() {
        expect(lisp`($round -3.5)`).toEqual(-3); // TODO: it should be "banker's rounding" (even rounding).
    });
    it("$round a -> value", function() {
        expect(lisp`($round -2.5)`).toEqual(-2);
    });
    it("$round a -> value", function() {
        expect(lisp`($round -1.5)`).toEqual(-1); // TODO: it should be "banker's rounding" (even rounding).
    });
    it("$round a -> value", function() {
        expect(lisp`($round -0.5)`).toEqual(-0);
    });
    it("$round a -> value", function() {
        expect(lisp`($round 0.5)`).toEqual(1); // TODO: it should be "banker's rounding" (even rounding).
    });
    it("$round a -> value", function() {
        expect(lisp`($round 1.5)`).toEqual(2);
    });
    it("$round a -> value", function() {
        expect(lisp`($round 2.5)`).toEqual(3); // TODO: it should be "banker's rounding" (even rounding).
    });
    it("$round a -> value", function() {
        expect(lisp`($round 3.5)`).toEqual(4);
    });
    it("$round +Infinity -> +Infinity", function() {
        expect(lisp`($round +Infinity)`).toEqual(+Infinity);
    });
    it("$round -Infinity -> -Infinity", function() {
        expect(lisp`($round -Infinity)`).toEqual(-Infinity);
    });
    it("$round NaN -> NaN", function() {
        expect(lisp`($round NaN)`).toEqual(NaN);
    });
    it("$round true -> 1", function() {
        expect(lisp`($round true)`).toEqual(1);
    });
    it("$round false -> 0", function() {
        expect(lisp`($round false)`).toEqual(0);
    });
    it("$round undefined -> NaN", function() {
        expect(lisp`($round undefined)`).toEqual(NaN);
    });
    it("$round null -> NaN", function() {
        expect(lisp`($round null)`).toEqual(NaN);
    });
    it("$round nil -> NaN", function() {
        expect(lisp`($round nil)`).toEqual(NaN);
    });
    it("$round () -> NaN", function() {
        expect(lisp`($round ())`).toEqual(NaN);
    });
    it("$round (a) -> NaN", function() {
        expect(lisp`($round '(5))`).toEqual(NaN);
    });
    it("$round a -> value", function() {
        expect(lisp`($round "0")`).toEqual(0);
    });
    it("$round a -> NaN", function() {
        expect(lisp`($round "a")`).toEqual(NaN);
    });
});


describe("operator.core.$abs", function() {
    it("$abs -> throw", function() {
        expect(() => lisp`($abs)`).toThrow();
    });
    it("$abs a b -> throw", function() {
        expect(() => lisp`($abs 0 0)`).toThrow();
    });
    it("$abs a -> value", function() {
        expect(lisp`($abs 0)`).toEqual(0);
    });
    it("$abs a -> value", function() {
        expect(lisp`($abs 3)`).toEqual(3);
    });
    it("$abs a -> value", function() {
        expect(lisp`($abs -3)`).toEqual(3);
    });
    it("$abs a -> value", function() {
        expect(lisp`($abs 3.1)`).toEqual(3.1);
    });
    it("$abs a -> value", function() {
        expect(lisp`($abs -3.1)`).toEqual(3.1);
    });
    it("$abs +Infinity -> +Infinity", function() {
        expect(lisp`($abs +Infinity)`).toEqual(+Infinity);
    });
    it("$abs -Infinity -> -Infinity", function() {
        expect(lisp`($abs -Infinity)`).toEqual(+Infinity);
    });
    it("$abs NaN -> NaN", function() {
        expect(lisp`($abs NaN)`).toEqual(NaN);
    });
    it("$abs true -> 1", function() {
        expect(lisp`($abs true)`).toEqual(1);
    });
    it("$abs false -> 0", function() {
        expect(lisp`($abs false)`).toEqual(0);
    });
    it("$abs undefined -> NaN", function() {
        expect(lisp`($abs undefined)`).toEqual(NaN);
    });
    it("$abs null -> NaN", function() {
        expect(lisp`($abs null)`).toEqual(NaN);
    });
    it("$abs nil -> NaN", function() {
        expect(lisp`($abs nil)`).toEqual(NaN);
    });
    it("$abs () -> NaN", function() {
        expect(lisp`($abs ())`).toEqual(NaN);
    });
    it("$abs (a) -> NaN", function() {
        expect(lisp`($abs '(5))`).toEqual(NaN);
    });
    it("$abs a -> value", function() {
        expect(lisp`($abs "0")`).toEqual(0);
    });
    it("$abs a -> NaN", function() {
        expect(lisp`($abs "a")`).toEqual(NaN);
    });
});


describe("operator.core.$sign", function() {
    it("$sign -> throw", function() {
        expect(() => lisp`($sign)`).toThrow();
    });
    it("$sign a b -> throw", function() {
        expect(() => lisp`($sign 0 0)`).toThrow();
    });
    it("$sign a -> value", function() {
        expect(lisp`($sign 0)`).toEqual(0);
    });
    it("$sign a -> value", function() {
        expect(lisp`($sign 3)`).toEqual(1);
    });
    it("$sign a -> value", function() {
        expect(lisp`($sign -3)`).toEqual(-1);
    });
    it("$sign a -> value", function() {
        expect(lisp`($sign 3.1)`).toEqual(1);
    });
    it("$sign a -> value", function() {
        expect(lisp`($sign -3.1)`).toEqual(-1);
    });
    it("$sign +Infinity -> +Infinity", function() {
        expect(lisp`($sign +Infinity)`).toEqual(1);
    });
    it("$sign -Infinity -> -Infinity", function() {
        expect(lisp`($sign -Infinity)`).toEqual(-1);
    });
    it("$sign NaN -> NaN", function() {
        expect(lisp`($sign NaN)`).toEqual(NaN);
    });
    it("$sign true -> 1", function() {
        expect(lisp`($sign true)`).toEqual(1);
    });
    it("$sign false -> 0", function() {
        expect(lisp`($sign false)`).toEqual(0);
    });
    it("$sign undefined -> NaN", function() {
        expect(lisp`($sign undefined)`).toEqual(NaN);
    });
    it("$sign null -> NaN", function() {
        expect(lisp`($sign null)`).toEqual(NaN);
    });
    it("$sign nil -> NaN", function() {
        expect(lisp`($sign nil)`).toEqual(NaN);
    });
    it("$sign () -> NaN", function() {
        expect(lisp`($sign ())`).toEqual(NaN);
    });
    it("$sign (a) -> NaN", function() {
        expect(lisp`($sign '(5))`).toEqual(NaN);
    });
    it("$sign a -> value", function() {
        expect(lisp`($sign "0")`).toEqual(0);
    });
    it("$sign a -> NaN", function() {
        expect(lisp`($sign "a")`).toEqual(NaN);
    });
});
