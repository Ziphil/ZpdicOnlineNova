//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, MouseEvent, ReactElement, RefObject, cloneElement, isValidElement, useCallback, useRef, useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {
  Button,
  ButtonIconbag,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogPane,
  GeneralIcon,
  useTrans
} from "zographia";
import {EditTemplateWordForm, EditTemplateWordFormValue, EditTemplateWordInitialData, useEditTemplateWord} from "/client/component/compound/edit-word-form";
import {create} from "/client/component/create";
import {assignRef} from "/client/util/ref";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


export const EditTemplateWordDialog = create(
  require("./edit-word-dialog.scss"), "EditTemplateWordDialog",
  function ({
    dictionary,
    initialData,
    trigger,
    formRef,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditTemplateWordInitialData | null,
    trigger: ReactElement,
    formRef?: RefObject<UseFormReturn<EditTemplateWordFormValue>>,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editWordDialog");

    const [open, setOpen] = useState(false);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const innerFormRef = useRef<UseFormReturn<EditTemplateWordFormValue>>(null);
    const actualFormRef = formRef ?? innerFormRef;

    const formSpec = useEditTemplateWord(dictionary, initialData, closeDialog);
    assignRef(actualFormRef, formSpec.form);

    const openDialog = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      formSpec.form.reset();
      setOpen(true);
    }, [formSpec.form]);

    return (
      <Fragment>
        {(isValidElement<any>(trigger)) && cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogCloseButton/>
            <DialogBody>
              <EditTemplateWordForm dictionary={dictionary} initialData={initialData} formSpec={formSpec}/>
            </DialogBody>
            <DialogFooter>
              <Button onClick={formSpec.handleSubmit}>
                <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                {trans("button.confirm")}
              </Button>
            </DialogFooter>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);