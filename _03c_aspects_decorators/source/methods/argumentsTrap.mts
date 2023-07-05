// #region preamble
import type {
  SetReturnType
} from "type-fest";

import type {
  ClassMethodDecoratorFunction
} from "#mixin_decorators/source/types/ClassMethodDecoratorFunction.mjs";

import type {
  MethodsOnlyType
} from "#mixin_decorators/source/types/MethodsOnlyType.mjs";

import type {
  GenericFunction
} from "../types/GenericFunction.mjs";

import getReplacementMethodAndAspects from "./replacementMethod.mjs";

// #endregion preamble

/**
 * A class method decorator for working with arguments before the body of a function.
 * @typeParam This - the base type we're working with.
 * @typeParam Key - the method name.
 * @param trapMethod - the argument trap to add.
 *
 * @internal
 * @remarks
 *
 * Import AspectsDecorators instead of this file directly.
 */
export default function argumentsTrap<
  This extends MethodsOnlyType,
  Key extends keyof This,
>
(
  trapMethod: SetReturnType<This[Key], void>
): ClassMethodDecoratorFunction<This, Key, true, false>
{
  return function(
    method: This[Key],
    context: ClassMethodDecoratorContext<This, This[Key]>
  ): This[Key]
  {
    void(context);
    const replacement = getReplacementMethodAndAspects<This, Key>(method);
    const { argumentTraps } = replacement.userContext;
    argumentTraps.unshift(trapMethod);
    return replacement.source as This[Key];
  }
}

argumentsTrap satisfies ClassMethodDecoratorFunction<
  MethodsOnlyType, keyof MethodsOnlyType, true, [SetReturnType<GenericFunction, void>]
>;
