import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({template: ''})
export class DestructibleComponent implements OnDestroy {
  protected subs: Subscription[] = [];
  protected onDestroy?: () => void;

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.onDestroy) this.onDestroy();
  }
}
