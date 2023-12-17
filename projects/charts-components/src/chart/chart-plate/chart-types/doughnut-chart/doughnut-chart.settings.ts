export class DoughnutChartSettings {
  public readonly id: string;
  public name: string = `Unnamed-${Math.round(Math.random() * 9999)}`;

  constructor(id?: string) {
    this.id = id ?? `id-${Math.floor(Math.random() * 9999 + 1)}`;
  }

  public static copy(model: DoughnutChartSettings): DoughnutChartSettings {
    const result = new DoughnutChartSettings(model.id);
    result.name = model.name;
    return result;
  }

  public setName(name: string): DoughnutChartSettings {
    return DoughnutChartSettings.copy({ ...this, name });
  }

  public isSame(model: DoughnutChartSettings): boolean {
    if (this.name !== model.name) return false;
    if (this.id !== model.id) return false;
    return true;
  }
}
