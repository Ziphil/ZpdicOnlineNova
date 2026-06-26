/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faFileExport} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableCard,
  CheckableCardBody,
  ControlContainer,
  ControlLabel,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  MultiLineText,
  Radio,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {useDialogOpen} from "/client/hook/dialog";
import {DictionaryWithUser} from "/server/internal/skeleton";
import {useQueueDownloadDictionary} from "./queue-download-dictionary-button-hook";


export const QueueDownloadDictionaryButton = create(
  require("../common.scss"), "QueueDownloadDictionaryButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DictionaryWithUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("queueDownloadDictionaryButton");

    const {form, handleSubmit} = useQueueDownloadDictionary(dictionary);
    const {open, setOpen, openDialog, handleSubmitAndClose} = useDialogOpen({handleSubmit, onOpen: form.resetAll});
    const {register} = form;

    return (
      <Fragment>
        <div styleName="button">
          <Button variant="light" onClick={openDialog} {...rest}>
            <ButtonIconbag><GeneralIcon icon={faFileExport}/></ButtonIconbag>
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
                  <ControlLabel>{trans("label.format.label")}</ControlLabel>
                  <div styleName="card-group">
                    {["zpdic", "slime"].map((format) => (
                      <CheckableCard key={format} styleName="card">
                        <Radio value={format} {...register("format")}/>
                        <CheckableCardBody styleName="card-body">
                          <div styleName="label">
                            <div styleName="label-main">{trans(`label.format.${format}`)}</div>
                            <MultiLineText styleName="label-helper" lineHeight="narrow">{trans(`labelHelper.format.${format}`)}</MultiLineText>
                          </div>
                        </CheckableCardBody>
                      </CheckableCard>
                    ))}
                  </div>
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
