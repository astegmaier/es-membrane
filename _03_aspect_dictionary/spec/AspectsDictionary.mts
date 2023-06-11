import type {
  Class
} from "type-fest";

import {
  type ModuleSourceDirectory,
  getModuleDefaultClassWithArgs,
} from "#stage_utilities/source/AsyncSpecModules.mjs";

import NumberStringClass from "#aspect_dictionary/fixtures/components/shared/NumberStringClass.mjs";
import type {
  NumberStringType
} from "#aspect_dictionary/fixtures/types/NumberStringType.mjs";

import NumberStringClass_Spy from "#aspect_dictionary/fixtures/generated/stubs/Spy.mjs";

import {
  getAspectBuilderForClass,
  buildAspectDictionaryForDriver,
  getAspectDictionaryForDriver,
  getAspectDecorators,
} from "#aspect_dictionary/source/generated/AspectsDictionary.mjs";

describe("AspectsDictionary", () => {
  // #region beforeAll
  class NST_Base extends NumberStringClass {
  }

  const baseBuilder = getAspectBuilderForClass<NumberStringType>(NST_Base);
  (baseBuilder.classInvariants as unknown[]).splice(0, baseBuilder.classInvariants.length);

  class SpySubclassOne extends NumberStringClass_Spy {
  }
  class SpySubclassTwo extends NumberStringClass_Spy {
  }
  class SpySubclassThree extends NumberStringClass_Spy {
  }

  class NST_Middle extends NST_Base {
  }

  class NST_Final extends NST_Middle {
  }

  const middleBuilder = getAspectBuilderForClass<NumberStringType>(NST_Middle);
  middleBuilder.classInvariants.push(SpySubclassOne, SpySubclassTwo);

  const finalBuilder = getAspectBuilderForClass<NumberStringType>(NST_Final);
  finalBuilder.classInvariants.push(SpySubclassThree);

  let NST_Aspect: Class<NumberStringType>;

  beforeAll(async () => {
    const generatedDir: ModuleSourceDirectory = {
      importMeta: import.meta,
      pathToDirectory: "../../spec-generated/"
    };

    NST_Aspect = await getModuleDefaultClassWithArgs<[], NumberStringType>(
      generatedDir, "empty/AspectDriver.mjs"
    );
  });
  // #endregion beforeAll

  it("getAspectBuilderForClass() inserts constructors in the right order", () => {
    class NST_Other extends NST_Base {
    }

    const otherBuilder = getAspectBuilderForClass<NumberStringType>(NST_Other);

    expect(middleBuilder.classInvariants).toEqual([
      SpySubclassOne,
      SpySubclassTwo,
    ]);

    expect(finalBuilder.classInvariants).toEqual([
      SpySubclassOne,
      SpySubclassTwo,
      SpySubclassThree,
    ]);

    expect(otherBuilder.classInvariants).toEqual([]);
  });

  it("getAspectDictionaryForObject creates aspects in the right order", () => {
    const middleObject = new NST_Middle;

    const middleAspects = buildAspectDictionaryForDriver<NumberStringType>(middleObject, new NumberStringClass);

    expect(middleAspects.classInvariants.length).toBe(2);
    expect(middleAspects.classInvariants[0]).toBeInstanceOf(SpySubclassOne);
    expect(middleAspects.classInvariants[1]).toBeInstanceOf(SpySubclassTwo);

    expect(
      getAspectDictionaryForDriver<NumberStringType>(middleObject)
    ).toBe(middleAspects);

    const otherObject = new NST_Middle;
    const otherAspects = buildAspectDictionaryForDriver<NumberStringType>(otherObject, new NumberStringClass);
    expect(otherAspects).not.toBe(middleAspects);

    expect(otherAspects.classInvariants.length).toBe(2);
    expect(otherAspects.classInvariants[0]).toBeInstanceOf(SpySubclassOne);
    expect(otherAspects.classInvariants[1]).toBeInstanceOf(SpySubclassTwo);

    expect(otherAspects.classInvariants[0]).not.toBe(middleAspects.classInvariants[0]);
    expect(otherAspects.classInvariants[1]).not.toBe(middleAspects.classInvariants[1]);

    const finalObject = new NST_Final;
    const finalAspects = buildAspectDictionaryForDriver<NumberStringType>(finalObject, new NumberStringClass);

    expect(finalAspects.classInvariants.length).toBe(3);
    expect(finalAspects.classInvariants[0]).toBeInstanceOf(SpySubclassOne);
    expect(finalAspects.classInvariants[1]).toBeInstanceOf(SpySubclassTwo);
    expect(finalAspects.classInvariants[2]).toBeInstanceOf(SpySubclassThree);

    expect(finalAspects.classInvariants[0]).not.toBe(middleAspects.classInvariants[0]);
    expect(finalAspects.classInvariants[1]).not.toBe(middleAspects.classInvariants[1]);

    expect(finalAspects.classInvariants[0]).not.toBe(otherAspects.classInvariants[0]);
    expect(finalAspects.classInvariants[1]).not.toBe(otherAspects.classInvariants[1]);
  });

  it("getAspectDecorators<Type> gets a collection of aspect decorators", () => {
    const { classInvariants } = getAspectDecorators<NumberStringType>();

    @classInvariants(SpySubclassTwo)
    @classInvariants(SpySubclassThree)
    class NST_Decorated extends NST_Base {
    }

    const decoratedBuilder = getAspectBuilderForClass<NumberStringType>(NST_Decorated);
    expect(decoratedBuilder.classInvariants).toEqual([
      SpySubclassTwo,
      SpySubclassThree,
    ]);

    const decorated = new NST_Decorated;
    const aspects = buildAspectDictionaryForDriver<NumberStringType>(decorated, new NumberStringClass);

    expect(aspects.classInvariants.length).toBe(2);
    expect(aspects.classInvariants[0]).toBeInstanceOf(SpySubclassTwo);
    expect(aspects.classInvariants[1]).toBeInstanceOf(SpySubclassThree);

    @classInvariants(SpySubclassOne)
    class NST_Subclassed extends NST_Decorated {
    }

    const subclassedBuilder = getAspectBuilderForClass<NumberStringType>(NST_Subclassed);
    expect(subclassedBuilder.classInvariants).toEqual([
      SpySubclassOne,
      SpySubclassTwo,
      SpySubclassThree,
    ]);
  });

  it("getAspectDecorators<Type> with an AspectDriver installs the requested decorators", () => {
    const { classInvariants } = getAspectDecorators<NumberStringType>();

    @classInvariants(SpySubclassTwo)
    @classInvariants(SpySubclassThree)
    class NST_Decorated extends NST_Aspect {
    }

    const decorated = new NST_Decorated;
    {
      const aspects = getAspectDictionaryForDriver(decorated);

      expect(aspects.classInvariants.length).toBe(2);
      expect(aspects.classInvariants[0]).toBeInstanceOf(SpySubclassTwo);
      expect(aspects.classInvariants[1]).toBeInstanceOf(SpySubclassThree);
    }

    @classInvariants(SpySubclassOne)
    class NST_Subclassed extends NST_Decorated {
    }

    const subclassed = new NST_Subclassed;
    {
      const aspects = getAspectDictionaryForDriver(subclassed);

      expect(aspects.classInvariants.length).toBe(3);
      expect(aspects.classInvariants[0]).toBeInstanceOf(SpySubclassOne);
      expect(aspects.classInvariants[1]).toBeInstanceOf(SpySubclassTwo);
      expect(aspects.classInvariants[2]).toBeInstanceOf(SpySubclassThree);
    }
  });
});
