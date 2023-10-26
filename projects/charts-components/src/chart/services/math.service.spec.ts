import { TestBed } from '@angular/core/testing';

import { MathService } from './math.service';
import { should } from "@artstesh/it-should";
import { Forger } from "@artstesh/forger";

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    service = new MathService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("sort()", () => {
    interface ITest {id: number, value: string}

    it("empty primitive success", () => {
      const list: number[] = [];
      //
      const result = service.sort(list, x => x);
      //
      should().array(result).empty();
    });

    it("empty object success", () => {
      const list: ITest[] = [];
      //
      const result = service.sort(list, x => x.id);
      //
      should().array(result).empty();
    });


    it("one-element primitive success", () => {
      const list = Forger.create<number[]>({arrayLength: 1})!;
      //
      const result = service.sort(list, x => x);
      //
      should().array(result).equal(list);
    });

    it("one-element object success", () => {
      const list = Forger.create<ITest[]>({arrayLength: 1})!;
      //
      const result = service.sort(list, x => x.id);
      //
      should().array(result).equal(list);
    });

    it("a few primitive success", () => {
      const list: number[] = [100, 1];
      const expected = [1,100];
      //
      const result = service.sort(list, x => x);
      //
      should().array(result).equal(expected);
    });

    it("a few object success", () => {
      const list: ITest[] = [{id: 20, value: ''},{id: 2, value: ''}];
      const expected: ITest[] = [{id: 2, value: ''},{id: 20, value: ''}];
      //
      const result = service.sort(list, x => x.id);
      //
      should().array(result).equal(expected, x => x!.id);
    });
  });
});
