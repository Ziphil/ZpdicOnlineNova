//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Dispatch, Fragment, ReactElement, SetStateAction, SyntheticEvent, cloneElement, useCallback, useState} from "react";
import {
  Button,
  ButtonIconbag,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {WordParameter} from "/client-new/skeleton";
import {useSearchWordAdvanced} from "./search-word-advanced-dialog-hook";


export const SearchWordAdvancedDialog = create(
  require("./search-word-advanced-dialog.scss"), "SearchWordAdvancedDialog",
  function ({
    trigger,
    parameter,
    onParameterSet,
    ...rest
  }: {
    trigger: ReactElement,
    parameter: WordParameter,
    onParameterSet?: Dispatch<SetStateAction<WordParameter>>,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("searchWordAdvancedDialog");

    const {form, handleSubmit} = useSearchWordAdvanced();
    const {register, formState: {errors}} = form;

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const handleSubmitAndClose = useCallback(async function (event: SyntheticEvent): Promise<void> {
      await handleSubmit(event, (parameter) => {
        onParameterSet?.(parameter);
        setOpen(false);
      });
    }, [onParameterSet, handleSubmit]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} {...rest}>
          <DialogPane>
            <DialogCloseButton/>
            <DialogBody is="form">
              <div styleName="button">
                <Button type="submit" onClick={handleSubmitAndClose}>
                  <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                  {trans("button.confirm")}
                </Button>
              </div>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);