/* eslint-disable react/jsx-closing-bracket-location */

import {MouseEvent, ReactElement, useCallback, useRef} from "react";
import {UseFormReturn} from "react-hook-form";
import {Popover} from "zographia";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {EditExampleFormValue, getEditExampleFormValue} from "/client/component/compound/edit-example-form";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Example} from "/client/skeleton";
import {ExamplePopoverInner} from "./example-popover-inner";


export const ExamplePopover = create(
  require("./example-popover.scss"), "ExamplePopover",
  function ({
    dictionary,
    example,
    trigger,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    example: Example,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const formRef = useRef<UseFormReturn<EditExampleFormValue>>(null);
    const triggerRef = useRef<(event: MouseEvent<HTMLButtonElement>) => void>(null);

    const handleEdit = useCallback(function (example: Example, event: MouseEvent<HTMLButtonElement>): void {
      triggerRef.current?.(event);
      requestAnimationFrame(() => {
        formRef.current?.reset(getEditExampleFormValue({type: "example", example}));
      });
    }, []);

    return (
      <>
        <Popover styleName="root" trigger={trigger} triggerType="hover" triggerRest={500} placement="bottom-start" {...rest}>
          <ExamplePopoverInner dictionary={dictionary} example={example} onEdit={handleEdit}/>
        </Popover>
        <EditExampleDialog dictionary={dictionary} initialData={null} trigger={triggerRef} formRef={formRef}/>
      </>
    );

  }
);