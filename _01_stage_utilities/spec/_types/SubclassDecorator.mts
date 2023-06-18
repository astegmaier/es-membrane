import type {
  SubclassDecorator,
  SubclassDecoratorSequence
} from "../../source/types/SubclassDecorator.mjs";

import type {
  StaticAndInstance,
} from "../../source/types/StaticAndInstance.mjs";

import type {
  MixinClass
} from "../../source/types/MixinClass.mjs";

import type {
  RightExtendsLeft
} from "../../source/types/Utility.mjs";

describe("Subclass decorators: ", () => {
  type FirstClassInterface = {
    readonly index: number;
  };
  class FirstClass implements FirstClassInterface {
    static beginning = 'opening';

    readonly index: number;
  
    constructor(myIndex: number) {
      this.index = myIndex;
    }
  }

  const secondKey = Symbol("key 2");
  const thirdKey = Symbol("key 3");

  type SecondStaticAndInstance = RightExtendsLeft<StaticAndInstance<typeof secondKey>, {
    staticFields: {
      middle: string;
    },
    instanceFields: {
      isMiddle: boolean;
    },
    symbolKey: typeof secondKey;
  }>;

  type ThirdStaticAndInstance = RightExtendsLeft<StaticAndInstance<typeof thirdKey>, {
    staticFields: {
      readonly ending: string;
    },
    instanceFields: {
      readonly length: number;
    },
    symbolKey: typeof thirdKey;
  }>;

  it("A decorator applies static and instance fields correctly", () => {
    const secondDecorator: SubclassDecorator<typeof FirstClass, SecondStaticAndInstance, false> = function(
      baseClass: typeof FirstClass,
      context
    ): MixinClass<SecondStaticAndInstance["staticFields"], SecondStaticAndInstance["instanceFields"], typeof FirstClass>
    {
      void(context);
      return class extends baseClass {
        static readonly middle = 'second class';
        isMiddle = true;
      }
    }

    @secondDecorator
    class SecondClass extends FirstClass
    {
    }

    expect(SecondClass.beginning).toBe("opening");
    expect(
      (SecondClass as typeof FirstClass & SecondStaticAndInstance["staticFields"])
    .middle).toBe("second class");

    const secondObj = new SecondClass(51);
    expect<FirstClassInterface>(secondObj).toBeTruthy();
    expect(secondObj.index).toBe(51);
    expect(
      (secondObj as FirstClassInterface & SecondStaticAndInstance["instanceFields"])
    .isMiddle).toBe(true);
  });

  it("A decorator can take arguments", () => {
    const secondDecorator: SubclassDecorator<typeof FirstClass, SecondStaticAndInstance, [string]> = function(
      middleString: string
    ): SubclassDecorator<typeof FirstClass, SecondStaticAndInstance, false>
    {
      return function(
        baseClass: typeof FirstClass,
        context
      ): MixinClass<SecondStaticAndInstance["staticFields"], SecondStaticAndInstance["instanceFields"], typeof FirstClass>
      {
        void(context);
        return class extends baseClass {
          static readonly middle = middleString;
          isMiddle = false;
        }
      }
    }

    @secondDecorator("class number two")
    class SecondClass extends FirstClass
    {
    }

    expect(SecondClass.beginning).toBe("opening");
    expect(
      (SecondClass as typeof FirstClass & SecondStaticAndInstance["staticFields"])
    .middle).toBe("class number two");

    const secondObj = new SecondClass(84);
    expect<FirstClassInterface>(secondObj).toBeTruthy();
    expect(secondObj.index).toBe(84);
    expect(
      (secondObj as FirstClassInterface & SecondStaticAndInstance["instanceFields"])
    .isMiddle).toBe(false);
  });

  it("A sequence can have multiple decorators, but only with unique symbol keys", () => {
    const secondDecorator: SubclassDecorator<typeof FirstClass, SecondStaticAndInstance, false> = function(
      baseClass: typeof FirstClass,
      context
    ): MixinClass<SecondStaticAndInstance["staticFields"], SecondStaticAndInstance["instanceFields"], typeof FirstClass>
    {
      void(context);
      return class extends baseClass {
        static readonly middle = 'second class';
        isMiddle = true;
      }
    }

    const thirdDecorator: SubclassDecorator<typeof FirstClass, ThirdStaticAndInstance, false> = function(
      baseClass: typeof FirstClass,
      context
    ): MixinClass<ThirdStaticAndInstance["staticFields"], ThirdStaticAndInstance["instanceFields"], typeof FirstClass>
    {
      void(context);
      return class extends baseClass {
        static readonly ending = "end";
        length = 0;
      }
    }

    type DecoratorSequence<Interfaces extends ReadonlyArray<StaticAndInstance<symbol>>> =
      SubclassDecoratorSequence<typeof FirstClass, Interfaces, false>;

    expect<
      DecoratorSequence<[SecondStaticAndInstance, ThirdStaticAndInstance]>
    >
    (
      [secondDecorator, thirdDecorator]
    ).toBeTruthy();

    expect<
      DecoratorSequence<[SecondStaticAndInstance, SecondStaticAndInstance]>
    >
    (
      // @ts-expect-error mismatched third decorator to SecondStaticAndInstance
      [secondDecorator, thirdDecorator]
    ).toBeTruthy();

    expect<
      DecoratorSequence<[SecondStaticAndInstance, SecondStaticAndInstance]>
    >
    (
      // @ts-expect-error cannot reuse the same decorator twice
      [secondDecorator, secondDecorator]
    ).toBeTruthy();
  });
});
