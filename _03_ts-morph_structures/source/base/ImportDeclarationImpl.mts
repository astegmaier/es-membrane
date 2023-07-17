import {
  AssertEntryStructure,
  ImportSpecifierStructure,
  OptionalKind,
  StructureKind,
  type ImportDeclarationStructure
} from "ts-morph";

import type {
  stringOrWriterFunction
} from "../types/ts-morph-native.mjs";

import {
  stringOrWriterFunctionArray
} from "./utilities.mjs";
import ImportSpecifierImpl from "./ImportSpecifierImpl.mjs";
import { CloneableStructure } from "../types/CloneableStructure.mjs";

export default class ImportDeclarationImpl implements ImportDeclarationStructure
{
  leadingTrivia: stringOrWriterFunction[] = [];
  trailingTrivia: stringOrWriterFunction[] = [];
  isTypeOnly = false;
  defaultImport: string | undefined = undefined;
  namespaceImport: string | undefined = undefined;
  namedImports: (stringOrWriterFunction | ImportSpecifierStructure)[] = [];
  moduleSpecifier: string;
  assertElements: OptionalKind<AssertEntryStructure>[] = [];
  readonly kind: StructureKind.ImportDeclaration = StructureKind.ImportDeclaration;

  constructor(
    moduleSpecifier: string
  )
  {
    this.moduleSpecifier = moduleSpecifier;
  }

  public static clone(
    other: OptionalKind<ImportDeclarationStructure>
  ): ImportDeclarationImpl
  {
    const clone = new ImportDeclarationImpl(other.moduleSpecifier);

    clone.leadingTrivia = stringOrWriterFunctionArray(other.leadingTrivia);
    clone.trailingTrivia = stringOrWriterFunctionArray(other.trailingTrivia);
    clone.isTypeOnly = other.isTypeOnly ?? false;
    clone.defaultImport = other.defaultImport;
    clone.namespaceImport = other.namespaceImport;

    // XXX ajvincent come back here for ImportSpecifierSpecificStructure
    if (Array.isArray(other.namedImports)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      console.warn("ImportSpecifierSpecificStructure");
      other.namedImports.forEach(namedImport => {
        if ((typeof namedImport === "string") || (typeof namedImport === "function"))
          clone.namedImports.push(namedImport);
        else
          clone.namedImports.push(ImportSpecifierImpl.clone(namedImport));
      });
    }
    else if (other.namedImports) {
      clone.namedImports = [other.namedImports];
    }

    if (other.assertElements) {
      clone.assertElements = other.assertElements.slice();
    }

    return clone;
  }
}
ImportDeclarationImpl satisfies CloneableStructure<ImportDeclarationStructure>;