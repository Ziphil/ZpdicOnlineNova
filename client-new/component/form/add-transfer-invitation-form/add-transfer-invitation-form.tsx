/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faRocketLaunch} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client-new/component/atom/control-container";
import {UserSelect} from "/client-new/component/atom/user-select";
import {create} from "/client-new/component/create";
import {useDialogOpen} from "/client-new/hook/dialog";
import {Dictionary} from "/client-new/skeleton";
import {useAddTransferInvitation} from "./add-transfer-invitation-form-hook";


export const AddTransferInvitationForm = create(
  require("../common.scss"), "AddTransferInvitationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addTransferInvitationForm");

    const {form, handleSubmit} = useAddTransferInvitation(dictionary);
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen(handleSubmit);
    const {control, getFieldState, formState: {errors}} = form;

    return (
      <Fragment>
        <div>
          <Button scheme="red" variant="light" onClick={openDialog} {...rest}>
            <ButtonIconbag><GeneralIcon icon={faRocketLaunch}/></ButtonIconbag>
            {trans("button.open")}
          </Button>
        </div>
        <Dialog open={open} onOpenSet={setOpen}>
          <DialogPane>
            <DialogCloseButton/>
            <DialogBody is="form">
              <h2 styleName="dialog-heading">{trans("heading")}</h2>
              <div styleName="dialog-control">
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.user")}
                  </ControlLabel>
                  <Controller name="user" control={control} render={({field}) => (
                    <UserSelect user={field.value} onSet={field.onChange} error={getFieldState("user").error !== undefined}/>
                  )}/>
                  <ControlErrorMessage name="user" form={form} trans={trans}/>
                </ControlContainer>
              </div>
              <div styleName="dialog-button">
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