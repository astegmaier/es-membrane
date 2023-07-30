import {
  CallSignatureDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import { CloneableStructure } from "../types/CloneableStructure.mjs";
import StructureBase from "../decorators/StructureBase.mjs";

import KindedStructure, {
  type KindedStructureFields
} from "../decorators/KindedStructure.mjs";
import JSDocableNode, {
  type JSDocableNodeStructureFields
} from "../decorators/JSDocableNode.mjs";
import ParameteredNode, {
  type ParameteredNodeStructureFields
} from "../decorators/ParameteredNode.mjs";
import TypeParameteredNode, {
  type TypeParameteredNodeStructureFields
} from "../decorators/TypeParameteredNode.mjs";
import ReturnTypedNode, {
  type ReturnTypedNodeStructureFields
} from "../decorators/ReturnTypedNode.mjs";

import MultiMixinBuilder from "#mixin_decorators/source/MultiMixinBuilder.mjs";

const CallSignatureDeclarationBase = MultiMixinBuilder<
  [
    KindedStructureFields<StructureKind.CallSignature>,
    JSDocableNodeStructureFields,
    ParameteredNodeStructureFields,
    TypeParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
  ], typeof StructureBase
>
(
  [
    KindedStructure<StructureKind.CallSignature>(StructureKind.CallSignature),
    JSDocableNode,
    ParameteredNode,
    TypeParameteredNode,
    ReturnTypedNode,
  ],
  StructureBase
);

export default class CallSignatureDeclarationImpl
extends CallSignatureDeclarationBase
implements CallSignatureDeclarationStructure
{
  public static clone(
    other: OptionalKind<CallSignatureDeclarationStructure>
  ): CallSignatureDeclarationImpl
  {
    const declaration = new CallSignatureDeclarationImpl;

    CallSignatureDeclarationBase.cloneTrivia(other, declaration);
    CallSignatureDeclarationBase.cloneJSDocable(other, declaration);
    CallSignatureDeclarationBase.cloneParametered(other, declaration);
    CallSignatureDeclarationBase.cloneTypeParametered(other, declaration);
    CallSignatureDeclarationBase.cloneReturnTyped(other, declaration);

    return declaration;
  }
}

CallSignatureDeclarationImpl satisfies CloneableStructure<CallSignatureDeclarationStructure>;