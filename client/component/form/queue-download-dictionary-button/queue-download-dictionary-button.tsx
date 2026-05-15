/* eslint-disable react/jsx-closing-bracket-location */

import {faFileExport} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithUser} from "/server/internal/skeleton";
import {useQueueDownloadDictionary} from "./queue-download-dictionary-button-hook";
import {QueueDownloadDictionaryFormatSelect} from "./queue-download-dictionary-format-select";


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
    const {control} = form;

    return (
      <div styleName="button">
        <Controller name="format" control={control} render={({field}) => (
          <QueueDownloadDictionaryFormatSelect type={field.value} onSet={field.onChange}/>
        )}/>
        <Button variant="light" onClick={handleSubmit} {...rest}>
          <ButtonIconbag><GeneralIcon icon={faFileExport}/></ButtonIconbag>
          {trans("button.start")}
        </Button>
      </div>
    );

  }
);
