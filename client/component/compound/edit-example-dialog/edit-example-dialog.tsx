//

import {faArrowUpRightFromSquare} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, MouseEvent, ReactElement, cloneElement, useCallback, useRef, useState} from "react";
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
import {EditExampleForm, EditExampleFormValue, EditExampleInitialData, getEditExampleFormValue} from "/client/component/compound/edit-example-form";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {checkOpeningExternal} from "/client/util/form";


export const EditExampleDialog = create(
  require("./edit-example-dialog.scss"), "EditExampleDialog",
  function ({
    dictionary,
    initialData,
    trigger,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditExampleInitialData | null,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editExampleDialog");

    const [open, setOpen] = useState(false);
    const addExamplePageUrlBase = useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}/example`);

    const formRef = useRef<() => EditExampleFormValue>(null);

    const openDialog = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      if (checkOpeningExternal(event)) {
        const value = getEditExampleFormValue(initialData);
        const addExamplePageUrl = addExamplePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addExamplePageUrl);
      } else {
        setOpen(true);
      }
    }, [addExamplePageUrlBase, initialData]);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const openExternal = useCallback(function (): void {
      const value = formRef.current?.();
      if (value !== undefined) {
        const addExamplePageUrl = addExamplePageUrlBase + `/${(value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addExamplePageUrl);
      }
    }, [addExamplePageUrlBase]);

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
              <EditExampleForm dictionary={dictionary} initialData={initialData} formRef={formRef} onSubmit={closeDialog}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);