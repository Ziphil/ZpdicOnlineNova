/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faExclamation, faFileImport} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Badge,
  BadgeIconbag,
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
  LoadingIcon,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {DetailedDictionary} from "/client/skeleton";
import {useUploadDictionary} from "./upload-dictionary-button-hook";


export const UploadDictionaryButton = create(
  require("../common.scss"), "UploadDictionaryButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("uploadDictionaryButton");

    const {form, status, handleSubmit} = useUploadDictionary(dictionary);
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {control, getFieldState, formState: {errors}} = form;

    return (
      <Fragment>
        <div styleName="button">
          <Button variant="light" onClick={openDialog} {...rest}>
            <ButtonIconbag><GeneralIcon icon={faFileImport}/></ButtonIconbag>
            {trans("button.open")}
          </Button>
          {(status === "loading") ? (
            <Badge scheme="gray">
              <BadgeIconbag><LoadingIcon/></BadgeIconbag>
              {trans("status.loading")}
            </Badge>
          ) : (status === "success") ? (
            <Badge scheme="blue">
              <BadgeIconbag><GeneralIcon icon={faCheck}/></BadgeIconbag>
              {trans("status.success")}
            </Badge>
          ) : (status === "error") ? (
            <Badge scheme="red">
              <BadgeIconbag><GeneralIcon icon={faExclamation}/></BadgeIconbag>
              {trans("status.error")}
            </Badge>
          ) : null}
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


function getFileName(disposition: string): string {
  const match = disposition.match(/filename="(.+)"/);
  const encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
  if (encodedMatch !== null) {
    return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
  } else if (match !== null) {
    return match[1];
  } else {
    return "dictionary.json";
  }
}