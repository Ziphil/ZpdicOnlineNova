/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faFileImport} from "@fortawesome/sharp-regular-svg-icons";
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
  FileInput,
  GeneralIcon,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {DictionaryWithUser} from "/server/internal/skeleton";
import {useQueueUploadDictionary} from "./queue-upload-dictionary-button-hook";


export const QueueUploadDictionaryButton = create(
  require("../common.scss"), "QueueUploadDictionaryButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DictionaryWithUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("queueUploadDictionaryButton");

    const {form, handleSubmit} = useQueueUploadDictionary(dictionary);
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {control, getFieldState} = form;

    return (
      <Fragment>
        <div styleName="button">
          <Button variant="light" onClick={openDialog} {...rest}>
            <ButtonIconbag><GeneralIcon icon={faFileImport}/></ButtonIconbag>
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
                    {trans("label.file")}
                  </ControlLabel>
                  <Controller name="file" control={control} render={({field}) => (
                    <FileInput
                      value={field.value}
                      onSet={field.onChange}
                      error={getFieldState("file").error !== undefined}
                      accepts={[".json", ".dic"]}
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
