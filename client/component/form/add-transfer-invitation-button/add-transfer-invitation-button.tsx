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
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {UserSelect} from "/client/component/atom/user-select";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {Dictionary} from "/server/internal/skeleton";
import {useAddTransferInvitation} from "./add-transfer-invitation-button-hook";


export const AddTransferInvitationButton = create(
  require("../common.scss"), "AddTransferInvitationButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addTransferInvitationButton");

    const {form, handleSubmit} = useAddTransferInvitation(dictionary);
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
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