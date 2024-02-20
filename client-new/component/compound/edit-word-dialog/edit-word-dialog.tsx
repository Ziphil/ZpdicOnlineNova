//

import {faArrowUpRightFromSquare} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement, useCallback, useState} from "react";
import {useHref} from "react-router-dom";
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
import {EditWordForm} from "/client-new/component/compound/edit-word-form";
import {create} from "/client-new/component/create";
import {EditableWord, EnhancedDictionary, Word} from "/client-new/skeleton";


export const EditWordDialog = create(
  require("./edit-word-dialog.scss"), "EditWordDialog",
  function ({
    dictionary,
    word,
    trigger,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | EditableWord | null,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editWordDialog");

    const [open, setOpen] = useState(false);
    const addWordPageUrl = useHref(`/dictionary/${dictionary.number}/word/${(word !== null) ? word.number : "new"}`);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const openExternal = useCallback(function (): void {
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
              <EditWordForm dictionary={dictionary} word={word} onSubmit={closeDialog}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);