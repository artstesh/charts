import { ChartConstants } from '../../../../models/chart-constants';

export class OrdinateAxisSettings {
  displayGrid: boolean = false;
  right: boolean = false;

  public static copy(model: OrdinateAxisSettings): OrdinateAxisSettings {
    const result = new OrdinateAxisSettings();
    result.displayGrid = model.displayGrid;
    result.right = model.right;
    return result;
  }

  public getAxisId = () => (this.right ? ChartConstants.RightAxisId : ChartConstants.LeftAxisId);

  public isSame(model: OrdinateAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    if (this.right !== model.right) return false;
    return true;
  }

  public setDisplayGrid(displayGrid: boolean): OrdinateAxisSettings {
    return OrdinateAxisSettings.copy({ ...this, displayGrid });
  }

  public setRight(right: boolean = true): OrdinateAxisSettings {
    return OrdinateAxisSettings.copy({ ...this, right });
  }
}
