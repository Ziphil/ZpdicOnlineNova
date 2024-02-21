/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faPlus} from "@fortawesome/sharp-regular-svg-icons";
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
  FileInput,
  GeneralIcon,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client-new/component/atom/control-container";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {useAddResource} from "./add-resource-button-hook";


export const AddResourceButton = create(
  require("../common.scss"), "AddResourceButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addResourceButton");

    const {form, handleSubmit} = useAddResource(dictionary);
    const {control, getFieldState, formState: {errors}} = form;

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    const handleSubmitAndClose = useCallback(async function (event: SyntheticEvent): Promise<void> {
      await handleSubmit(event, () => setOpen(false));
    }, [handleSubmit]);

    return (
      <Fragment>
        <Button variant="light" onClick={openDialog} {...rest}>
          <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
          {trans("button.open")}
        </Button>
        <Dialog open={open} onOpenSet={setOpen}>
          <DialogPane>
            <DialogCloseButton/>
            <DialogBody is="form">
              <h2 styleName="dialog-heading">{trans("heading")}</h2>
              <div styleName="dialog-control">
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.file")}
                  </ControlLabel>
                  <Controller name="file" control={control} render={({field}) => (
                    <FileInput
                      value={field.value}
                      onSet={field.onChange}
                      error={getFieldState("file").error !== undefined}
                      accepts={["image/*"]}
                      multiple={false}
                    />
                  )}/>
                  <ControlErrorMessage name="file" form={form} trans={trans}/>
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