import { ChartConstants } from '../../../../models/chart-constants';
import { AxisTitleSettings } from '../models/axis-title.settings';

export class OrdinateAxisSettings {
  displayGrid: boolean = false;
  right: boolean = false;
  titleSettings?: AxisTitleSettings;

  public static copy(model: OrdinateAxisSettings): OrdinateAxisSettings {
    const result = new OrdinateAxisSettings();
    result.displayGrid = model.displayGrid;
    result.right = model.right;
    result.titleSettings = model.titleSettings;
    return result;
  }

  public getAxisId = () => (this.right ? ChartConstants.RightAxisId : ChartConstants.LeftAxisId);

  public isSame(model: OrdinateAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    if (this.right !== model.right) return false;
    if (this.titleSettings !== model.titleSettings) return false;
    return true;
  }

  public setDisplayGrid(displayGrid: boolean): OrdinateAxisSettings {
    return OrdinateAxisSettings.copy({ ...this, displayGrid });
  }

  public setTitleSettings(titleSettings: AxisTitleSettings): OrdinateAxisSettings {
    return OrdinateAxisSettings.copy({ ...this, titleSettings });
  }

  public setRight(right: boolean = true): OrdinateAxisSettings {
    return OrdinateAxisSettings.copy({ ...this, right });
  }
}
