import { Align, FontSpec, ScriptableAndScriptableOptions, ScriptableCartesianScaleContext } from 'chart.js/dist/types';

export interface AxisTitleSettings {
  /** If true, displays the axis title. */
  display?: boolean;
  /** Alignment of the axis title. */
  align?: Align;
  /** The text for the title, e.g. "# of People" or "Response Choices". */
  text?: string | string[];
  /** Color of the axis label. */
  color?: string;
  /** Information about the axis title font. */
  font?: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableCartesianScaleContext>;
  /** Padding on the (relative) top side of this axis label. */
  paddingTop?: number;
  /** Padding on the (relative) bottom side of this axis label. */
  paddingBottom?: number;
  /** This is a shorthand for defining top/bottom to the same values. */
  paddingY?: number;
}
