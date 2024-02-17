//

import {faCheck, faRocketLaunch} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, SyntheticEvent, useCallback, useState} from "react";
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
import {UserSelect} from "/client-new/component/atom/user-select";
import {create} from "/client-new/component/create";
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
    const {control, formState: {errors}} = form;

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
        <div>
          <Button scheme="red" variant="light" onClick={openDialog}>
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
                    <UserSelect user={field.value} onSet={field.onChange}/>
                  )}
                  />
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