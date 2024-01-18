import { LineController } from 'chart.js';
import { ChartAreaDataModel } from '../../../models';

export class AreaChartType extends LineController {
  getLabelAndValue(index: any) {
    const me = this;
    const parsed = (me.getDataset().data as ChartAreaDataModel[])?.[index];

    return {
      label: '',
      value: `bottom: ${parsed?.y}, up: ${parsed?.y2}`,
    };
  }

  draw = () => {
    LineController.prototype.draw.apply(this);

    const me = this;
    const chart = me.chart;
    const rects = me._cachedMeta.data;

    var meta = this.getMeta();
    var yScale = this.getScaleForId('y');
    if (!yScale || !meta?.data?.length) return;
    const tickHeight = yScale.height / yScale.max;

    const gradient = chart.ctx.createLinearGradient(0, 0, this.getScaleForId('x')!.width, 0);

    // Add three color stops
    gradient.addColorStop(0, 'rgba(255, 222, 45, 0.4)');
    gradient.addColorStop(0.5, 'rgba(108, 186, 47, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 222, 45, 0.4)');

    const firstPoint = this.getDataset().data[0] as ChartAreaDataModel;
    const lastPoint = this.getDataset().data[this.getDataset().data.length - 1] as ChartAreaDataModel;
    let startWidth = 1;
    let endWidth = 1;
    if (firstPoint && lastPoint) {
      startWidth = firstPoint.y2 - firstPoint.y;
      endWidth = lastPoint.y2 - lastPoint.y;
    }
    chart.ctx.save();
    chart.ctx.fillStyle = this.getDataset().backgroundColor as CanvasGradient;
    chart.ctx.lineWidth = 0;
    chart.ctx.beginPath();
    chart.ctx.moveTo(meta.data[0].x, meta.data[0].y + tickHeight * startWidth);
    chart.ctx.lineTo(meta.data[0].x, meta.data[0].y);
    meta.data.forEach((point, index) => {
      const actual = meta.data[index] as any;
      const next = meta.data[index + 1] as any;
      let datum = this.getDataset().data[index] as ChartAreaDataModel;
      const width = datum?.y2 - datum?.y ?? 1;
      if (!next) {
        return;
      }
      chart.ctx.bezierCurveTo(actual.cp2x, actual.cp2y, next.cp1x, next.cp1y, next.x, next.y);
    });
    chart.ctx.lineTo(meta.data[meta.data.length - 1].x, meta.data[meta.data.length - 1].y - tickHeight * endWidth);

    for (let index = meta.data.length - 1; index > 0; index--) {
      const actual = meta.data[index] as any;
      const next = meta.data[index - 1] as any;
      let datum = this.getDataset().data[index] as ChartAreaDataModel;
      const width = datum?.y2 - datum?.y ?? 1;
      if (!next) {
        return;
      }
      chart.ctx.bezierCurveTo(
        actual.cp1x,
        actual.cp1y - tickHeight * width,
        next.cp2x,
        next.cp2y - tickHeight * width,
        next.x,
        next.y - tickHeight * width,
      );
    }

    chart.ctx.closePath();
    chart.ctx.fill();
    chart.ctx.restore();
  };
}

AreaChartType.id = 'area';
