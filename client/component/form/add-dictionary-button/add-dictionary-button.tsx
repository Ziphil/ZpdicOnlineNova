//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
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
  Input,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {fakBookCirclePlus} from "/client/component/atom/icon";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {useAddDictionary} from "./add-dictionary-button-hook";


export const AddDictionaryButton = create(
  require("../common.scss"), "AddDictionaryButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addDictionaryButton");

    const {form, handleSubmit} = useAddDictionary();
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <Fragment>
        <div>
          <Button variant="light" onClick={openDialog} {...rest}>
            <ButtonIconbag><GeneralIcon icon={fakBookCirclePlus}/></ButtonIconbag>
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
                    {trans("label.name")}
                  </ControlLabel>
                  <Input error={getFieldState("name").error !== undefined} {...register("name")}/>
                  <ControlErrorMessage name="name" form={form} trans={trans}/>
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