
import { globalObj, objConstructor, funConstructor } from '../s-exp/global-this';



describe("global-this", function() {
    it("global-this", function() {
        expect(globalObj === global).toEqual(true);
        expect(globalObj === globalThis).toEqual(true);
        expect(objConstructor === Object).toEqual(true);
        expect(funConstructor === Function).toEqual(true);
    });
});
