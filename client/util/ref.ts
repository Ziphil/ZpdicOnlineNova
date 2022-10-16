//

import {
  Ref,
  RefCallback
} from "react";


export function mergeRefs<T>(refs: ReadonlyArray<Ref<T>>): RefCallback<T> {
  const mergedRef = function (value: T | null): void {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        const castRef = ref as {current: T | null};
        castRef.current = value;
      }
    }
  };
  return mergedRef;
}

export function fillRef<T>(ref: Ref<T>, value: T): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null) {
    const castRef = ref as {current: T};
    castRef.current = value;
  }
}