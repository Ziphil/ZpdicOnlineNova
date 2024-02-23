//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, SyntheticEvent, cloneElement, useCallback, useState} from "react";
import {
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  Input,
  Textarea,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {useAddCommission} from "./add-commission-dialog-hook";


export const AddCommissionDialog = create(
  require("./add-commission-dialog.scss"), "AddCommissionDialog",
  function ({
    dictionary,
    trigger,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("addCommissionDialog");

    const {form, handleSubmit} = useAddCommission(dictionary);
    const {register, formState: {errors}} = form;

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const handleSubmitAndClose = useCallback(async function (event: SyntheticEvent): Promise<void> {
      await handleSubmit(event);
      setOpen(false);
    }, [handleSubmit]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} {...rest}>
          <DialogPane>
            <DialogCloseButton/>
            <DialogBody is="form">
              <h2 styleName="heading">{trans("heading")}</h2>
              <div styleName="control">
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.name")}
                  </ControlLabel>
                  <Input {...register("name")}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.comment")}
                  </ControlLabel>
                  <Textarea styleName="textarea" {...register("comment")}/>
                </ControlContainer>
              </div>
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