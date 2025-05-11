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
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {DictionaryWithExecutors} from "/client/skeleton";
import {useAddProposal} from "./add-proposal-dialog-hook";


export const AddProposalDialog = create(
  require("./add-proposal-dialog.scss"), "AddProposalDialog",
  function ({
    dictionary,
    trigger,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("addProposalDialog");

    const {form, handleSubmit} = useAddProposal(dictionary);
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {register, getFieldState, formState: {errors}} = form;

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
                  <Input
                    error={getFieldState("name").error !== undefined}
                    required={true}
                    {...register("name")}
                  />
                  <ControlErrorMessage name="name" form={form} trans={trans}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.comment")}
                  </ControlLabel>
                  <Textarea
                    styleName="textarea"
                    error={getFieldState("comment").error !== undefined}
                    {...register("comment")}
                  />
                  <ControlErrorMessage name="comment" form={form} trans={trans}/>
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