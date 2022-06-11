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
  const rootRef = useRef<never>(null);
  const handleRef = useRef<never>(null);
  const [{dragging}, connectDrag, connectPreview] = useDrag({
    type,
    item: {index},
    collect: (monitor) => ({dragging: monitor.isDragging()})
  });
  const [, connectDrop] = useDrop<{index: number}, unknown, unknown>({
    accept: type,
    hover: (item) => {
      const draggingIndex = item.index;
      const hoverIndex = index;
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