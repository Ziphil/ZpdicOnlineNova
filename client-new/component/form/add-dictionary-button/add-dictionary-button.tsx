//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, useState} from "react";
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
import {fakBookCirclePlus} from "/client-new/component/atom/icon";
import {create} from "/client-new/component/create";
import {useAddDictionary} from "./add-dictionary-button-hook";


export const AddDictionaryButton = create(
  require("./add-dictionary-button.scss"), "AddDictionaryButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addDictionaryButton");

    const [open, setOpen] = useState(false);

    const {form, handleSubmit} = useAddDictionary();
    const {register, formState: {errors}} = form;

    return (
      <Fragment>
        <Button variant="light" onClick={() => setOpen(true)} {...rest}>
          <ButtonIconbag><GeneralIcon icon={fakBookCirclePlus}/></ButtonIconbag>
          {trans("button.open")}
        </Button>
        <Dialog open={open} onOpenSet={setOpen}>
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
              </div>
              <div styleName="button">
                <Button type="submit" onClick={handleSubmit}>
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