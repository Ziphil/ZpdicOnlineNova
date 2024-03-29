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
import {EditWordFormValue, EditWordInitialData} from "/client/component/compound/edit-word-form";
import {create} from "/client/component/create";
import {EnhancedDictionary} from "/client/skeleton";


export const EditWordDialog = create(
  require("./edit-word-dialog.scss"), "EditWordDialog",
  function ({
    dictionary,
    initialData,
    forceAdd = false,
    trigger,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    initialData: EditWordInitialData | null,
    forceAdd?: boolean,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editWordDialog");

    const [open, setOpen] = useState(false);
    const addWordPageUrlBase = useHref(`/dictionary/${dictionary.number}/word`);

    const formRef = useRef<() => EditWordFormValue>(null);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const openExternal = useCallback(function (): void {
      const value = formRef.current?.();
      if (value !== undefined) {
        const addWordPageUrl = addWordPageUrlBase + `/${(forceAdd || value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addWordPageUrl);
      }
    }, [addWordPageUrlBase, forceAdd]);

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
              <EditWordForm dictionary={dictionary} initialData={initialData} forceAdd={forceAdd} formRef={formRef} onSubmit={closeDialog}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);