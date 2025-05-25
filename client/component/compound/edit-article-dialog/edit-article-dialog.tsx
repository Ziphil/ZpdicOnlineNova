//

import {faArrowUpRightFromSquare, faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, MouseEvent, ReactElement, cloneElement, useCallback, useRef, useState} from "react";
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
import {Dictionary} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {checkOpeningExternal} from "/client/util/form";


export const EditArticleDialog = create(
  require("./edit-article-dialog.scss"), "EditArticleDialog",
  function ({
    dictionary,
    initialData,
    trigger,
    ...rest
  }: {
    dictionary: Dictionary,
    initialData: EditArticleInitialData | null,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editExampleDialog");

    const [open, setOpen] = useState(false);
    const addArticlePageUrlBase = useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}/edit/article`);

    const formRef = useRef<() => EditArticleFormValue>(null);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const formSpec = useEditArticle(dictionary, initialData, closeDialog);

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

    const openExternal = useCallback(function (): void {
      const value = formRef.current?.();
      if (value !== undefined) {
        const addArticlePageUrl = addArticlePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addArticlePageUrl);
      }
    }, [addArticlePageUrlBase]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogOutsideButtonContainer>
              <DialogOutsideButton onClick={openExternal}>
                <DialogOutsideButtonIconbag><GeneralIcon icon={faArrowUpRightFromSquare}/></DialogOutsideButtonIconbag>
                {trans("button.external")}
              </DialogOutsideButton>
            </DialogOutsideButtonContainer>
            <DialogCloseButton/>
            <DialogBody>
              <EditArticleForm dictionary={dictionary} initialData={initialData} formSpec={formSpec} formRef={formRef}/>
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