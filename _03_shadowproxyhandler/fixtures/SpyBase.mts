import { DefaultMap } from "../../_01_stage_utilities/source/DefaultMap.mjs";

export default class SpyBase
{
  readonly spyMap: DefaultMap<string | symbol, jasmine.Spy> = new DefaultMap;

  getSpy(name: string | symbol) : jasmine.Spy
  {
    return this.spyMap.getDefault(name, () => jasmine.createSpy());
  }

  expectSpiesClearExcept(...names: (string | symbol)[]) : void
  {
    const nonEmptyNames: (string | symbol)[] = [];
    this.spyMap.forEach((spy, foundName) => {
      if (!names.includes(foundName) && (spy.calls.count() > 0))
        nonEmptyNames.push(foundName);
    });

    expect(nonEmptyNames).toEqual([]);
    names.forEach(name => expect(this.spyMap.has(name)).toBe(true));
  }
}