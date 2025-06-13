//

import {faArrowUpRightFromSquare, faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, MouseEvent, ReactElement, RefObject, cloneElement, useCallback, useRef, useState} from "react";
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
import {EditArticleForm, EditArticleFormValue, EditArticleInitialData, getEditArticleFormValue, useEditArticle} from "/client/component/compound/edit-article-form";
import {create} from "/client/component/create";
import {useConfirmAlert} from "/client/hook/window";
import {Dictionary} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {checkOpeningExternal} from "/client/util/form";
import {assignRef} from "/client/util/ref";


export const EditArticleDialog = create(
  require("./edit-article-dialog.scss"), "EditArticleDialog",
  function ({
    dictionary,
    initialData,
    trigger,
    formRef,
    ...rest
  }: {
    dictionary: Dictionary,
    initialData: EditArticleInitialData | null,
    trigger: ReactElement,
    formRef?: RefObject<UseFormReturn<EditArticleFormValue>>,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editArticleDialog");

    const [open, setOpen] = useState(false);
    const addArticlePageUrlBase = useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}/edit/article`);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const innerFormRef = useRef<UseFormReturn<EditArticleFormValue>>(null);
    const actualFormRef = formRef ?? innerFormRef;

    const formSpec = useEditArticle(dictionary, initialData, closeDialog);
    assignRef(actualFormRef, formSpec.form);

    const openDialog = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      if (checkOpeningExternal(event)) {
        const value = getEditArticleFormValue(initialData);
        const addArticlePageUrl = addArticlePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addArticlePageUrl);
      } else {
        formSpec.form.reset();
        setOpen(true);
      }
    }, [addArticlePageUrlBase, initialData, formSpec.form]);

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
        const addArticlePageUrl = addArticlePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addArticlePageUrl);
      }
    }, [addArticlePageUrlBase, actualFormRef]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
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
              <EditArticleForm dictionary={dictionary} initialData={initialData} formSpec={formSpec}/>
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