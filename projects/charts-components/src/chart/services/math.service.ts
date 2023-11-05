import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MathService {
  constructor() {}

  public sort<T>(list: T[], id: (el: T) => number): T[] {
    if (list.length < 2) return list;
    let baseIndex = Math.floor((list.length - 1) / 2);
    let pivot = list[baseIndex];
    const left = [];
    const right = [];
    list.splice(baseIndex, 1);
    list = [pivot].concat(list.splice(baseIndex, 1));
    for (let i = 1; i < list.length; i++) id(pivot) > id(list[i]) ? left.push(list[i]) : right.push(list[i]);
    return this.sort(left, id).concat(pivot, this.sort(right, id));
  }
}
