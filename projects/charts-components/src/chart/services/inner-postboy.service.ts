import { Injectable } from '@angular/core';
import { PostboyService } from '@artstesh/postboy';

@Injectable()
export class InnerPostboyService extends PostboyService {
  constructor() {
    super();
  }
}
