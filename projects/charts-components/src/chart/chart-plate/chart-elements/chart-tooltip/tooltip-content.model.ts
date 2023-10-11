import { Type } from '@angular/core';

export interface TooltipContentModel {
   [datasetLabel: string]: {
      externalContentHandler: Type<any>;
      tooltipColorOverride?: string;
   };
}
