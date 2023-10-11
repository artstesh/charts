import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import 'moment/locale/en-au';
import 'moment/locale/pt-br';
import moment from 'moment';

@Component({
   selector: 'ap-localized-date',
   templateUrl: './localized-date.component.html',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalizedDateComponent implements OnInit, OnDestroy {
   @Input() date?: string | Date | number;
   @Input() format: 'L' | 'LTS' | 'LT' = 'L';
   private subs: Subscription[] = [];
   value = '';

   constructor(
      private translate: TranslateService,
      private detector: ChangeDetectorRef
   ) {}

   ngOnInit(): void {
      this.subs.push(this.observeTranslation());
      this.updateValue();
   }

   private observeTranslation(): Subscription {
      return this.translate.onLangChange.subscribe(() => {
         this.updateValue();
      });
   }

   private updateValue() {
      moment.locale(this.translate.currentLang);
      const momentDate = moment(this.date);
      this.value = momentDate.isValid() ? momentDate.format(this.format) : '--/--/--';
      this.detector.detectChanges();
   }

   ngOnDestroy(): void {
      this.subs.forEach(s => s.unsubscribe());
   }
}
