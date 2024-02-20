/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faFileImport} from "@fortawesome/sharp-regular-svg-icons";
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
import {create} from "/client-new/component/create";
import {DetailedDictionary} from "/client-new/skeleton";
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

    const {form, handleSubmit} = useUploadDictionary(dictionary);
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
                    <FileInput value={field.value} onSet={field.onChange} multiple={false}/>
                  )}/>
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