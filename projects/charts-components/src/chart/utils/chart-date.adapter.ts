import { TimeUnit, _adapters, DateAdapter, ChartOptions } from 'chart.js';

const viewFormats = {
  default: 'M/d/yyyy',
  datetime: 'MMM d, yyyy, h:mm:ss a',
  millisecond: 'h:mm:ss.SSS a',
  second: 'h:mm:ss a',
  minute: 'h:mm a',
  hour: 'h a',
  day: 'MMM d',
  week: 'MMM d, yyyy',
  month: 'MMM yyyy',
  quarter: "'Q'Q '-' yyyy",
  year: 'yyyy',
};

export function registerAdapter() {
  _adapters._date.override({
    add: function (this: DateAdapter, timestamp: number, amount: number, unit: TimeUnit): number {
      const date = new Date(timestamp);
      switch (unit) {
        case 'millisecond':
          return date.getTime() + amount;
        case 'second':
          return date.setSeconds(date.getSeconds() + amount);
        case 'minute':
          return date.setMinutes(date.getMinutes() + amount);
        case 'hour':
          return date.setHours(date.getHours() + amount);
        case 'day':
          return date.setDate(date.getDate() + amount);
        case 'week':
          return date.setDate(date.getDate() + amount * 7);
        case 'month':
          return date.setMonth(date.getMonth() + amount);
        case 'quarter':
          return date.setMonth(date.getMonth() + amount * 3);
        case 'year':
          return date.setFullYear(date.getFullYear() + amount);
      }
    },
    diff: function (this: DateAdapter, a: number, b: number, unit: TimeUnit): number {
      let min = a > b ? b : a;
      let max = a < b ? a : b;
      const difference = new Date(new Date(max).getTime() - new Date(min).getTime());
      switch (unit) {
        case 'millisecond':
          return difference.getTime();
        case 'second':
          return difference.getTime() / 1000;
        case 'minute':
          return difference.getTime() / 60000;
        case 'hour':
          return difference.getTime() / 3600000;
        case 'day':
          return difference.getTime() / 86400000;
        case 'week':
          return difference.getTime() / 604800000;
        case 'month': {
          const d1 = new Date(a);
          const d2 = new Date(b);
          return d2.getMonth() + 12 * d2.getFullYear() - (d1.getMonth() + 12 * d1.getFullYear());
        }
        case 'quarter': {
          const d1 = new Date(a);
          const d2 = new Date(b);
          return (d2.getMonth() + 12 * d2.getFullYear() - (d1.getMonth() + 12 * d1.getFullYear())) / 3;
        }
        case 'year': {
          const d1 = new Date(a);
          const d2 = new Date(b);
          return d2.getFullYear() - d1.getFullYear();
        }
      }
    },
    endOf: function (this: DateAdapter, timestamp: number, unit: TimeUnit | 'isoWeek'): number {
      return timestamp;
    },
    format: function (this: DateAdapter, timestamp: number, format: TimeUnit): string {
      return new Date(timestamp).toLocaleString('en', { month: '2-digit', year: '2-digit', day: '2-digit' });
    },
    formats: function (this: DateAdapter): Record<string, string> {
      return viewFormats;
    },
    init: function (this: DateAdapter, chartOptions: ChartOptions) {},
    parse: function (this: DateAdapter, value: unknown, format?: TimeUnit): number | null {
      return new Date(value as any).getTime();
    },
    startOf: function (this: DateAdapter, timestamp: number, unit: TimeUnit | 'isoWeek', weekday?: number): number {
      return timestamp;
    },
  });
}
