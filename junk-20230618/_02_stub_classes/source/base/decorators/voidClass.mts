// #region preamble

import type {
  RightExtendsLeft
} from "#stage_utilities/source/types/Utility.mjs";

import type {
  StaticAndInstance
} from "#stage_utilities/source/types/StaticAndInstance.mjs";

import type {
  ConfigureStubDecorator
} from "../types/ConfigureStubDecorator.mjs";

import type {
  ExtendsAndImplements
} from "../ConfigureStub.mjs";

import type {
  TS_Method
} from "../../types/export-types.mjs";

import addBaseTypeImport from "../utilities/addBaseTypeImport.mjs";
import { OptionalKind, ParameterDeclarationStructure } from "ts-morph";

// #endregion preamble

declare const VoidClassKey: unique symbol;

export type VoidClassFields = RightExtendsLeft<StaticAndInstance<typeof VoidClassKey>, {
  staticFields: object,
  instanceFields: object,
  symbolKey: typeof VoidClassKey
}>;

const VoidClassDecorator: ConfigureStubDecorator<VoidClassFields, false> = function(
  this: void,
  baseClass
)
{
  return class extends baseClass {
    protected getExtendsAndImplementsTrap(context: Map<symbol, unknown>): ExtendsAndImplements
    {
      const inner = super.getExtendsAndImplementsTrap(context);
      return {
        extends: inner.extends,
        implements: inner.implements.map(value => `VoidMethodsOnly<${value}>`),
      };
    }

    protected methodTrap(
      methodStructure: TS_Method | null,
      isBefore: boolean,
    ) : void
    {
      super.methodTrap(methodStructure, isBefore);
      if (!isBefore)
        return;

      if (!methodStructure) {
        addBaseTypeImport(this, "VoidMethodsOnly.mjs", "VoidMethodsOnly");
        return;
      }

      methodStructure.returnType = "void";
    }


    protected buildMethodBodyTrap(
      methodStructure: TS_Method,
      remainingArgs: Set<OptionalKind<ParameterDeclarationStructure>>,
    ): void
    {
      this.voidArguments(remainingArgs);
      super.buildMethodBodyTrap(methodStructure, remainingArgs);
    }
  }
}

export default VoidClassDecorator;