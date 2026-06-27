/* eslint-disable react/jsx-closing-bracket-location */

import {DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {ReactElement, ReactNode, Ref, useCallback, useMemo} from "react";
import {create} from "/client/component/create";
import {moveArrayItem} from "/client/util/misc";


export const EditWordFormDndContext = create(
  null, "EditWordFormDndContext",
  function <T extends {id: string}>({
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

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const dndIds = useMemo(() => values.map((value) => value.id), [values]);

    const handleDragEnd = useCallback(function (event: DragEndEvent): void {
      const {active, over} = event;
      if (over && active.id !== over.id) {
        const activeIndex = values.findIndex((value) => value.id === active.id);
        const overIndex = values.findIndex((value) => value.id === over.id);
        if (move) {
          move(activeIndex, overIndex);
        } else {
          setValues((values) => moveArrayItem(values, activeIndex, overIndex));
        }
      }
    }, [values, setValues, move]);

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
        <SortableContext items={dndIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </DndContext>
    );

  }
);


export function useEditWordFormDndItem(id: string): {paneProps: any, paneRef: Ref<HTMLElement>, gripProps: any, dragging: boolean} {
  const {attributes, listeners, isDragging, setNodeRef, transform, transition} = useSortable({id, transition: {duration: 200, easing: "ease"}});
  const style = {
    transform: (transform !== null) ? `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})` : undefined,
    transition
  };
  const paneRef = setNodeRef;
  const paneProps = {style};
  const gripProps = {...attributes, ...listeners};
  return {paneProps, paneRef, gripProps, dragging: isDragging};
}