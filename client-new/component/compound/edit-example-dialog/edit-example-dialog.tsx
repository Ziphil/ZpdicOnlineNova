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
import {EditExampleForm} from "/client-new/component/compound/edit-example-form";
import {create} from "/client-new/component/create";
import {EnhancedDictionary, Example} from "/client-new/skeleton";


export const EditExampleDialog = create(
  require("./edit-example-dialog.scss"), "EditExampleDialog",
  function ({
    dictionary,
    example,
    trigger,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    example: Example | null,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editExampleDialog");

    const [open, setOpen] = useState(false);
    const addExamplePageUrl = useHref(`/dictionary/${dictionary.number}/example/${(example !== null) ? example.number : "new"}`);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const openExternal = useCallback(function (): void {
      window.open(addExamplePageUrl);
    }, [addExamplePageUrl]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogCloseButton/>
            <DialogOutsideButtonContainer>
              <DialogOutsideButton onClick={openExternal}>
                <DialogOutsideButtonIconbag><GeneralIcon icon={faArrowUpRightFromSquare}/></DialogOutsideButtonIconbag>
                {trans("button.external")}
              </DialogOutsideButton>
            </DialogOutsideButtonContainer>
            <DialogBody>
              <EditExampleForm dictionary={dictionary} example={example} onSubmit={closeDialog}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);