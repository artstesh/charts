import { should } from '@artstesh/it-should';
import { ColorCollector } from './color-collector';
import { Forger } from '@artstesh/forger';

describe('ColorCollector', () => {
  afterEach(() => {
    expect().nothing();
  });

  describe('getColor()', () => {
    it('below zero success', () => {
      const index = Forger.create<number>({ numberMin: -100, numberMax: -1 })!;
      //
      should().string(ColorCollector.getColor(index)).not.empty();
    });

    it('too big index success', () => {
      const index = Forger.create<number>({ numberMin: 1000 })!;
      //
      should().string(ColorCollector.getColor(index)).not.empty();
    });

    it('numbers are different for different indexes', () => {
      const index1 = Forger.create<number>({ numberMin: 0, numberMax: 10 })!;
      const index2 = Forger.create<number>({ numberMin: 12, numberMax: 22 })!;
      //
      const color1 = ColorCollector.getColor(index1);
      const color2 = ColorCollector.getColor(index2);
      //
      should().string(color1).not.equals(color2);
    });

    it('numbers are same for same indexes', () => {
      const index = Forger.create<number>({ numberMin: 0, numberMax: 1000 })!;
      //
      const color1 = ColorCollector.getColor(index);
      const color2 = ColorCollector.getColor(index);
      //
      should().string(color1).equals(color2);
    });
  });
});
