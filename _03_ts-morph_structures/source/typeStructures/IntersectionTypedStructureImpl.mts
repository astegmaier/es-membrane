import type {
  IntersectionTypedStructure
} from "./TypeStructure.mjs";

import {
  TypeStructureKind,
} from "./TypeStructureKind.mjs";

import ElementsTypedStructureAbstract from "./ElementsTypedStructureAbstract.mjs";

import {
  registerCallbackForTypeStructure
} from "./callbackToTypeStructureRegistry.mjs";

export default class IntersectionTypedStructureImpl
extends ElementsTypedStructureAbstract
implements IntersectionTypedStructure
{
  public readonly kind: TypeStructureKind.Intersection = TypeStructureKind.Intersection;

  public readonly prefix = "";
  public readonly postfix = "";
  public readonly joinCharacters = " & ";

  constructor() {
    super();
    registerCallbackForTypeStructure(this);
  }
}
