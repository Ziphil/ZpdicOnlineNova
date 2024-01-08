//

import {SetStateAction} from "react";


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