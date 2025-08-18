//

import {MutableRefObject, ReactElement, ReactNode, Ref, createContext, useCallback, useContext, useMemo, useRef, useState} from "react";
import {noop} from "ts-essentials";
import {moveArrayItem} from "/client/util/misc";


type SwapAnimationContextValue = {
  values: Array<{id: string}>,
  refs: MutableRefObject<Map<string, HTMLElement>>,
  styles: Record<string, any>,
  moveValue: (fromIndex: number, toIndex: number) => void
};

const swapAnimationContext = createContext<SwapAnimationContextValue>({
  values: [],
  refs: {current: new Map()},
  styles: {},
  moveValue: noop
});
const SwapAnimationContextProvider = swapAnimationContext["Provider"];

export const SwapAnimationContext = function <T extends {id: string}>({
  values,
  setValues,
  move,
  children
}: {
  values: Array<T>,
  setValues: (update: (values: Array<T>) => Array<T>) => void,
  move?: (fromIndex: number, toIndex: number) => void,
  children: ReactNode
}): ReactElement {
  const refs = useRef<Map<string, HTMLElement>>(new Map());
  const [styles, setStyles] = useState<Record<string, any>>({});
  const moveValue = useCallback(function (fromIndex: number, toIndex: number): void {
    const fromId = values[fromIndex].id;
    const toId = values[toIndex].id;
    const fromElement = refs.current.get(fromId);
    const toElement = refs.current.get(toId);
    if (fromElement && toElement) {
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();
      const fromTranslate = (fromRect.top < toRect.top) ? toRect.bottom - fromRect.bottom : toRect.top - fromRect.top;
      const toTranslate = (fromRect.top < toRect.top) ? fromRect.top - toRect.top : fromRect.bottom - toRect.bottom;
      setStyles({
        [fromId]: {transform: `translateY(${fromTranslate}px)`, transition: "0.2s transform"},
        [toId]: {transform: `translateY(${toTranslate}px)`, transition: "0.2s transform"}
      });
      setTimeout(() => {
        setStyles({});
        if (move) {
          move(fromIndex, toIndex);
        } else {
          setValues((values) => moveArrayItem(values, fromIndex, toIndex));
        }
      }, 200);
    }
  }, [values, setValues, move]);
  return (
    <SwapAnimationContextProvider value={{values, refs, styles, moveValue}}>
      {children}
    </SwapAnimationContextProvider>
  );
};

export function useSwapAnimationItem(id: string): {
  ref: Ref<any>,
  props: Record<string, any>,
  animating: boolean,
  canMoveUp: boolean,
  canMoveDown: boolean,
  moveUp: () => void,
  moveDown: () => void
} {
  const {values, refs, styles, moveValue} = useContext(swapAnimationContext);
  const props = (styles[id]) ? {style: styles[id]} : {};
  const ref = useCallback(function (element: HTMLElement | null): void {
    if (element) {
      refs.current.set(id, element);
    } else {
      refs.current.delete(id);
    }
  }, [id, refs]);
  const animating = styles[id] !== undefined;
  const canMoveUp = useMemo(() => values.findIndex((value) => value.id === id) > 0, [values, id]);
  const canMoveDown = useMemo(() => values.findIndex((value) => value.id === id) < values.length - 1, [values, id]);
  const moveUp = useCallback(function (): void {
    const index = values.findIndex((value) => value.id === id);
    if (index > 0) {
      moveValue(index, index - 1);
    }
  }, [id, values, moveValue]);
  const moveDown = useCallback(function (): void {
    const index = values.findIndex((value) => value.id === id);
    if (index < values.length - 1) {
      moveValue(index, index + 1);
    }
  }, [id, values, moveValue]);
  return {ref, props, animating, canMoveUp, canMoveDown, moveUp, moveDown};
};