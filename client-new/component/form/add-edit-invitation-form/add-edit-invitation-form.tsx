//

import {faBan, faCheck, faPlus} from "@fortawesome/sharp-regular-svg-icons";
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
import {UserList} from "/client-new/component/compound/user-list";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {Dictionary} from "/client-new/skeleton";
import {useAddEditInvitation} from "./add-edit-invitation-form-hook";


export const AddEditInvitationForm = create(
  require("./add-edit-invitation-form.scss"), "AddEditInvitationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addEditInvitationForm");

    const number = dictionary.number;
    const [authorizedUsers] = useResponse("fetchDictionaryAuthorizedUsers", {number, authority: "editOnly"});

    const {form, handleSubmit} = useAddEditInvitation(dictionary);
    const {control, formState: {errors}} = form;

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(() => {
      setOpen(true);
    }, []);

    const handleSubmitAndClose = useCallback(async function (event: SyntheticEvent): Promise<void> {
      await handleSubmit(event);
      setOpen(false);
    }, [handleSubmit]);

    return (
      <Fragment>
        <form styleName="root-table" {...rest}>
          <div>
            <Button type="submit" variant="light" onClick={openDialog}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.open")}
            </Button>
          </div>
          <UserList users={authorizedUsers} pageSpec={{size: 20}} emptyMessage={trans("empty")} renderFooter={(user) => (
            <Button scheme="red" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faBan}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          )}
          />
        </form>
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