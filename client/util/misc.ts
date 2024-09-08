//

import {SetStateAction} from "react";


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