//

import {faArrowUpRightFromSquare, faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, MouseEvent, ReactElement, Ref, RefObject, cloneElement, isValidElement, useCallback, useRef, useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {useHref} from "react-router-dom";
import rison from "rison";
import {
  Button,
  ButtonIconbag,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogOutsideButton,
  DialogOutsideButtonContainer,
  DialogOutsideButtonIconbag,
  DialogPane,
  GeneralIcon,
  useTrans
} from "zographia";
import {EditExampleForm, EditExampleFormValue, EditExampleInitialData, getEditExampleFormValue, useEditExample} from "/client/component/compound/edit-example-form";
import {create} from "/client/component/create";
import {useConfirmAlert} from "/client/hook/window";
import {DictionaryWithExecutors} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {checkOpeningExternal} from "/client/util/form";
import {assignRef} from "/client/util/ref";
import {isRef} from "/client/util/ref";


export const EditExampleDialog = create(
  require("./edit-example-dialog.scss"), "EditExampleDialog",
  function ({
    dictionary,
    initialData,
    trigger,
    formRef,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditExampleInitialData | null,
    trigger: ReactElement | Ref<(initialData: EditExampleInitialData | null, event: MouseEvent<HTMLButtonElement>) => void>,
    formRef?: RefObject<UseFormReturn<EditExampleFormValue>>,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editExampleDialog");

    const [open, setOpen] = useState(false);
    const addExamplePageUrlBase = useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}/edit/sentence`);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const innerFormRef = useRef<UseFormReturn<EditExampleFormValue>>(null);
    const actualFormRef = formRef ?? innerFormRef;

    const formSpec = useEditExample(dictionary, initialData, closeDialog);
    assignRef(actualFormRef, formSpec.form);

    const openDialog = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      if (checkOpeningExternal(event)) {
        const value = getEditExampleFormValue(initialData);
        const addExamplePageUrl = addExamplePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addExamplePageUrl);
      } else {
        formSpec.form.reset();
        setOpen(true);
      }
    }, [addExamplePageUrlBase, initialData, formSpec.form]);

    const triggerOpenDialog = useCallback(function (initialData: EditExampleInitialData | null, event: MouseEvent<HTMLButtonElement>): void {
      formSpec.form.reset(getEditExampleFormValue(initialData));
      setOpen(true);
    }, [formSpec.form]);
    if (isRef(trigger)) {
      assignRef(trigger, triggerOpenDialog);
    }

    const showConfirmAlert = useConfirmAlert();
    const changeDialogOpen = useCallback(function (open: boolean): void {
      if (!open && actualFormRef.current?.formState.isDirty) {
        const confirmed = showConfirmAlert();
        if (confirmed) {
          setOpen(open);
        }
      } else {
        setOpen(open);
      }
    }, [showConfirmAlert, actualFormRef]);

    const openExternal = useCallback(function (): void {
      const value = actualFormRef.current?.getValues();
      if (value !== undefined) {
        const addExamplePageUrl = addExamplePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addExamplePageUrl);
      }
    }, [addExamplePageUrlBase, actualFormRef]);

    return (
      <Fragment>
        {(isValidElement<any>(trigger)) && cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={changeDialogOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogOutsideButtonContainer>
              <DialogOutsideButton onClick={openExternal}>
                <DialogOutsideButtonIconbag><GeneralIcon icon={faArrowUpRightFromSquare}/></DialogOutsideButtonIconbag>
                {trans("button.external")}
              </DialogOutsideButton>
            </DialogOutsideButtonContainer>
            <DialogCloseButton/>
            <DialogBody>
              <EditExampleForm dictionary={dictionary} initialData={initialData} formSpec={formSpec}/>
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