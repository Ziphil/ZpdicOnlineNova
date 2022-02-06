//

import {
  RefObject,
  useRef
} from "react";
import {
  useDrag,
  useDrop
} from "react-dnd";


export function useDragDrop(type: string, index: number, move: (draggingIndex: number, hoverIndex: number) => void): [RefObject<never>, RefObject<never>, boolean] {
  let rootRef = useRef<never>(null);
  let handleRef = useRef<never>(null);
  let [{dragging}, connectDrag, connectPreview] = useDrag({
    type,
    item: {index},
    collect: (monitor) => ({dragging: monitor.isDragging()})
  });
  let [, connectDrop] = useDrop<{index: number}, unknown, unknown>({
    accept: type,
    hover: (item) => {
      let draggingIndex = item.index;
      let hoverIndex = index;
      if (draggingIndex !== hoverIndex) {
        move(draggingIndex, hoverIndex);
        item.index = hoverIndex;
      }
    }
  });
  connectDrag(handleRef);
  connectDrop(connectPreview(rootRef));
  return [rootRef, handleRef, dragging];
}