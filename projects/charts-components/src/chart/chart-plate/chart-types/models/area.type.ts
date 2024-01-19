import { LineController } from 'chart.js';
import { ChartAreaElementType } from './chart-area-element.type';
import { ChartAreaDataset } from './chart-area-dataset.type';

export class ChartAreaType extends LineController {
  getLabelAndValue(index: any) {
    const dataset = this.getDataset() as ChartAreaDataset;
    const parsed = dataset.data?.[index];

    const bottom = dataset.areaType === ChartAreaElementType.Bottom ? parsed.y2 : parsed.y;
    const top = dataset.areaType === ChartAreaElementType.Top ? parsed.y2 : parsed.y;
    return {
      label: '',
      value: `bottom: ${bottom}, up: ${top}`,
    };
  }

  draw = () => {
    const dataset = this.getDataset() as ChartAreaDataset;

    if (dataset.areaType === ChartAreaElementType.Bottom) {
      const mate = this.chart.getDatasetMeta(this.index - 1);
      if (!mate.visible) return;
    }
    LineController.prototype.draw.apply(this);
  };
}

ChartAreaType.id = 'area';
