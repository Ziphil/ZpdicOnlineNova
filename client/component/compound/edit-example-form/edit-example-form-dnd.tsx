//

import {DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {ReactElement, ReactNode, useCallback, useMemo} from "react";
import {create} from "/client/component/create";
import {moveArrayItem} from "/client/util/misc";


export const EditExampleFormDndContext = create(
  null, "EditExampleFormDndContext",
  function <T extends {id: string}>({
    values,
    setValues,
    children
  }: {
    values: Array<T>,
    setValues: (update: (values: Array<T>) => Array<T>) => void,
    children: ReactNode
  }): ReactElement {

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const dndIds = useMemo(() => values.map((value) => value.id), [values]);

    const handleDragEnd = useCallback(function (event: DragEndEvent): void {
      const {active, over} = event;
      if (over && active.id !== over.id) {
        const activeIndex = values.findIndex((value) => value.id === active.id);
        const overIndex = values.findIndex((value) => value.id === over.id);
        setValues((values) => moveArrayItem(values, activeIndex, overIndex));
      }
    }, [values, setValues]);

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dndIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </DndContext>
    );

  }
);


export function useEditExampleFormDndItem(id: string): {paneProps: any, gripProps: any, dragging: boolean} {
  const {attributes, listeners, isDragging, setNodeRef, transform, transition} = useSortable({id});
  const style = {
    transform: (transform !== null) ? `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})` : undefined,
    transition
  };
  const paneProps = {ref: setNodeRef, style};
  const gripProps = {...attributes, ...listeners};
  return {paneProps, gripProps, dragging: isDragging};
}