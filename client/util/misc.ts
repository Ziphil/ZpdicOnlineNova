//

import {SetStateAction} from "react";


export function toRoman(number: number): string {
  if (number > 0 && number < 4000) {
    const data = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]] as const;
    let result = "";
    for (const [value, roman] of data) {
      while (number >= value) {
        result += roman;
        number -= value;
      }
    }
    return result;
  } else {
    return "";
  }
}

export function escapeRegexp(string: string): string {
  const escapedString = string.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  return escapedString;
}

export function calcOffsetSpec(page: number, size: number): {offset: number, size: number} {
  const offset = size * page;
  return {offset, size};
}

export function resolveStateAction<S>(state: SetStateAction<S>, prevState: S): S {
  if (typeof state === "function") {
    const anyState = state as any;
    return anyState(prevState);
  } else {
    return state;
  }
}

export function moveArrayItem<T>(array: Array<T>, from: number, to: number): Array<T> {
  const nextArray = array.slice();
  nextArray.splice((to < 0) ? nextArray.length + to : to, 0, nextArray.splice(from, 1)[0]);
  return nextArray;
}