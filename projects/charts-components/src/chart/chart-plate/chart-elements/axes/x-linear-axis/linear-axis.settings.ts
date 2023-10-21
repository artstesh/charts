export class LinearAxisSettings {
  limits: [number | null, number | null] = [null, null];
  displayGrid: boolean = false;

  public isSame(model: LinearAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    return this.limits![0] === model.limits![0] && this.limits![1] === model.limits![1];
  }
}
