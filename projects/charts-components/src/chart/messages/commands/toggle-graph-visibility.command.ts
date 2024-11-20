import { PostboyGenericMessage } from "@artstesh/postboy";

/**
 * Represents a command to toggle the visibility of an element of a chart.
 */
export class ToggleGraphVisibilityCommand extends PostboyGenericMessage{
  public static readonly ID = '10f920e6-64e0-47b5-bc76-d9bcf6b2f89c';
  public get id(): string {
    return ToggleGraphVisibilityCommand.ID;
  }
  /**
   * @param {string} graphId - The identifier for the graph.
   * @param {boolean} [visible] - Optional flag indicating whether the graph is visible. If not provided, the current state would be toggled.
   */
  constructor(public graphId: string, public visible?: boolean) {
    super();
  }
}
