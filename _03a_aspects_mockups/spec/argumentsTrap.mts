// #region preamble
import type {
  SetReturnType
} from "type-fest";

import type {
  ClassMethodDecorator
} from "#mixin_decorators/source/types/ClassMethodDecorator.mjs";

import NumberStringClass from "#aspects/test-fixtures/fixtures/components/NumberStringClass.mjs";
import type {
  NumberStringType
} from "#aspects/test-fixtures/fixtures/types/NumberStringType.mjs";
// #endregion preamble

it("Aspects mockup: a trap for arguments before the function runs", () => {
  type ReturnForwardAssert = SetReturnType<NumberStringType["repeatForward"], void>;

  function argumentsTrap(
    callback: ReturnForwardAssert
  ): ClassMethodDecorator<NumberStringType, "repeatForward", true, false>
  {
    return function(
      method: NumberStringType["repeatForward"],
      context: ClassMethodDecoratorContext<NumberStringType, NumberStringType["repeatForward"]>
    ): NumberStringType["repeatForward"]
    {
      void(context);
      return function(...parameters: Parameters<NumberStringType["repeatForward"]>) {
        callback(...parameters);
        return method(...parameters);
      }
    }
  }
  argumentsTrap satisfies ClassMethodDecorator<
    NumberStringType, "repeatForward", true, [ callback: ReturnForwardAssert, ]
  >;

  function checkNumber(this: NumberStringType, s: string, n: number): void {
    if (n < 0) {
      throw new Error("number is negative!");
    }
  }
  checkNumber satisfies ReturnForwardAssert;

  class NST_Class extends NumberStringClass {
    @argumentsTrap(checkNumber)
    repeatForward(s: string, n: number): string {
      return super.repeatForward(s, n);
    }
  }

  const nst = new NST_Class;
  expect<string>(nst.repeatForward("foo", 3)).toBe("foofoofoo");

  expect<() => string>(
    () => nst.repeatForward("foo", -1)
  ).toThrowError("number is negative!");
});
