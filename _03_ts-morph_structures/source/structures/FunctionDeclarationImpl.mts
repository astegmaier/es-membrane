import {
  type FunctionDeclarationStructure,
  StructureKind,
  FunctionDeclarationOverloadStructure,
  OptionalKind,
} from "ts-morph";

import {
  cloneArrayOrUndefined,
} from "./utilities.mjs";
import { CloneableStructure } from "../types/CloneableStructure.mjs";

import KindedStructure, {
  type KindedStructureFields
} from "../decorators/KindedStructure.mjs";
import AmbientableNode, {
  type AmbientableNodeStructureFields
} from "../decorators/AmbientableNode.mjs";
import AsyncableNode, {
  type AsyncableNodeStructureFields
} from "../decorators/AsyncableNode.mjs";
import ExportableNode, {
  type ExportableNodeStructureFields
} from "../decorators/ExportableNode.mjs";
import GeneratorableNode, {
  type GeneratorableNodeStructureFields
} from "../decorators/GeneratorableNode.mjs";
import JSDocableNode, {
  type JSDocableNodeStructureFields
} from "../decorators/JSDocableNode.mjs";
import NameableNode, {
  type NameableNodeStructureFields
} from "../decorators/NameableNode.mjs";
import ParameteredNode, {
  type ParameteredNodeStructureFields
} from "../decorators/ParameteredNode.mjs";
import ReturnTypedNode, {
  type ReturnTypedNodeStructureFields
} from "../decorators/ReturnTypedNode.mjs";
import StatementedNode, {
  type StatementedNodeStructureFields
} from "../decorators/StatementedNode.mjs";
import TypeParameteredNode, {
  type TypeParameteredNodeStructureFields
} from "../decorators/TypeParameteredNode.mjs";

import MultiMixinBuilder from "#mixin_decorators/source/MultiMixinBuilder.mjs";
import StructureBase from "../decorators/StructureBase.mjs";
import FunctionDeclarationOverloadImpl from "./FunctionDeclarationOverloadImpl.mjs";

import cloneableStatementsMap from "./cloneableStatements.mjs";


const FunctionDeclarationBase = MultiMixinBuilder<
  [
    KindedStructureFields<StructureKind.Function>,
    AmbientableNodeStructureFields,
    AsyncableNodeStructureFields,
    ExportableNodeStructureFields,
    GeneratorableNodeStructureFields,
    JSDocableNodeStructureFields,
    NameableNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    StatementedNodeStructureFields,
    TypeParameteredNodeStructureFields,
  ],
  typeof StructureBase
>
(
  [
    KindedStructure<StructureKind.Function>(StructureKind.Function),
    AmbientableNode,
    AsyncableNode,
    ExportableNode,
    GeneratorableNode,
    JSDocableNode,
    NameableNode,
    ParameteredNode,
    ReturnTypedNode,
    StatementedNode,
    TypeParameteredNode,
  ],
  StructureBase
);

export default class FunctionDeclarationImpl
extends FunctionDeclarationBase
implements FunctionDeclarationStructure
{
  overloads: FunctionDeclarationOverloadImpl[] = [];

  public static clone(
    other: FunctionDeclarationStructure
  ): FunctionDeclarationImpl
  {
    const clone = new FunctionDeclarationImpl;

    clone.overloads = cloneArrayOrUndefined<
      OptionalKind<FunctionDeclarationOverloadStructure>,
      typeof FunctionDeclarationOverloadImpl
    >
    (
      other.overloads,
      FunctionDeclarationOverloadImpl
    );

    FunctionDeclarationBase.cloneTrivia(other, clone);
    FunctionDeclarationBase.cloneAmbientable(other, clone);
    FunctionDeclarationBase.cloneAsyncable(other, clone);
    FunctionDeclarationBase.cloneExportable(other, clone);
    FunctionDeclarationBase.cloneGeneratorable(other, clone);
    FunctionDeclarationBase.cloneJSDocable(other, clone);
    FunctionDeclarationBase.cloneNameable(other, clone);
    FunctionDeclarationBase.cloneParametered(other, clone);
    FunctionDeclarationBase.cloneReturnTyped(other, clone);
    FunctionDeclarationBase.cloneStatemented(other, clone);
    FunctionDeclarationBase.cloneTypeParametered(other, clone);

    return clone;
  }
}
FunctionDeclarationImpl satisfies CloneableStructure<FunctionDeclarationStructure>;

cloneableStatementsMap.set(StructureKind.Function, FunctionDeclarationImpl);