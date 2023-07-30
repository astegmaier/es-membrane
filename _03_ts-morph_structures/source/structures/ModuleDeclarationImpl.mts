import {
  ModuleDeclarationKind,
  ModuleDeclarationStructure,
  StructureKind
} from "ts-morph";

import cloneableStatementsMap from "./cloneableStatements.mjs";

import KindedStructure, {
  type KindedStructureFields
} from "../decorators/KindedStructure.mjs";
import AmbientableNode, {
  type AmbientableNodeStructureFields
} from "../decorators/AmbientableNode.mjs";
import ExportableNode, {
  type ExportableNodeStructureFields
} from "../decorators/ExportableNode.mjs";
import JSDocableNode, {
  type JSDocableNodeStructureFields
} from "../decorators/JSDocableNode.mjs";
import NamedNode, {
  type NamedNodeStructureFields
} from "../decorators/NamedNode.mjs";
import StatementedNode, {
  type StatementedNodeStructureFields
} from "../decorators/StatementedNode.mjs";

import MultiMixinBuilder from "#mixin_decorators/source/MultiMixinBuilder.mjs";
import StructureBase from "../decorators/StructureBase.mjs";
import {
  CloneableStructure
} from "../types/CloneableStructure.mjs";

const ModuleDeclarationBase = MultiMixinBuilder<
  [
    KindedStructureFields<StructureKind.Module>,
    AmbientableNodeStructureFields,
    ExportableNodeStructureFields,
    JSDocableNodeStructureFields,
    NamedNodeStructureFields,
    StatementedNodeStructureFields,
  ],
  typeof StructureBase
>
(
  [
    KindedStructure<StructureKind.Module>(StructureKind.Module),
    AmbientableNode,
    ExportableNode,
    JSDocableNode,
    NamedNode,
    StatementedNode,
  ],
  StructureBase
);

export default class ModuleDeclarationImpl
extends ModuleDeclarationBase
implements ModuleDeclarationStructure
{
  declarationKind: ModuleDeclarationKind | undefined = undefined;

  constructor(
    name: string
  )
  {
    super();
    this.name = name;
  }

  public static clone(
    other: ModuleDeclarationStructure
  ): ModuleDeclarationImpl
  {
    const clone = new ModuleDeclarationImpl(other.name);
    clone.declarationKind = other.declarationKind;

    ModuleDeclarationBase.cloneTrivia(other, clone);
    ModuleDeclarationBase.cloneAmbientable(other, clone);
    ModuleDeclarationBase.cloneExportable(other, clone);
    ModuleDeclarationBase.cloneJSDocable(other, clone);
    ModuleDeclarationBase.cloneStatemented(other, clone);

    return clone;
  }
}

ModuleDeclarationImpl satisfies CloneableStructure<ModuleDeclarationStructure>;

cloneableStatementsMap.set(StructureKind.Module, ModuleDeclarationImpl);