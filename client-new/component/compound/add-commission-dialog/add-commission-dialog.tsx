//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement} from "react";
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
import {useDialogOpen} from "/client-new/hook/dialog";
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
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {register, formState: {errors}} = form;

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