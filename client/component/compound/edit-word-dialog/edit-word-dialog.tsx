//

import {faArrowUpRightFromSquare} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement, useCallback, useRef, useState} from "react";
import {useHref} from "react-router-dom";
import rison from "rison";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogOutsideButton,
  DialogOutsideButtonContainer,
  DialogOutsideButtonIconbag,
  DialogPane,
  GeneralIcon,
  useTrans
} from "zographia";
import {EditWordForm} from "/client/component/compound/edit-word-form";
import {EditWordFormValue} from "/client/component/compound/edit-word-form/edit-word-form-hook";
import {create} from "/client/component/create";
import {EditableWord, EnhancedDictionary, Word} from "/client/skeleton";


export const EditWordDialog = create(
  require("./edit-word-dialog.scss"), "EditWordDialog",
  function ({
    dictionary,
    word,
    forceAdd = false,
    trigger,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | EditableWord | null,
    forceAdd?: boolean,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editWordDialog");

    const [open, setOpen] = useState(false);
    const addWordPageUrl = useHref(`/dictionary/${dictionary.number}/word/${(word !== null && !forceAdd) ? word.number : "new"}`);

    const formRef = useRef<() => EditWordFormValue>(null);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const openExternal = useCallback(function (): void {
      const getFormValue = formRef.current;
      const encodedFormValue = (getFormValue !== null) ? rison.encode(getFormValue()) : null;
      window.open(addWordPageUrl);
    }, [addWordPageUrl]);

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
              <EditWordForm dictionary={dictionary} word={word} forceAdd={forceAdd} formRef={formRef} onSubmit={closeDialog}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);