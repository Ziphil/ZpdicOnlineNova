/* eslint-disable react/jsx-closing-bracket-location */

import {DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {ReactElement, ReactNode, useCallback, useMemo} from "react";
import {create} from "/client-new/component/create";


export const EditWordFormDndContext = create(
  null, "EditWordFormDndContext",
  function <T extends {id: string}>({
    values,
    valueOperations,
    children
  }: {
    values: Array<T>,
    valueOperations: {swap: (firstIndex: number, secondIndex: number) => void},
    children: ReactNode
  }): ReactElement {

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const dndIds = useMemo(() => values.map((value) => value.id), [values]);

    const handleDragEnd = useCallback(function (event: DragEndEvent): void {
      const {active, over} = event;
      if (over && active.id !== over.id) {
        const activeIndex = values.findIndex((value) => value.id === active.id);
        const overIndex = values.findIndex((value) => value.id === over.id);
        valueOperations.swap(activeIndex, overIndex);
      }
    }, [values, valueOperations]);

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dndIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </DndContext>
    );

  }
);


export function useEditWordFormDndItem(id: string): {paneProps: any, gripProps: any} {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
  const style = {
    transform: (transform !== null) ? `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})` : undefined,
    transition
  };
  const paneProps = {ref: setNodeRef, style};
  const gripProps = {...attributes, ...listeners};
  return {paneProps, gripProps};
}