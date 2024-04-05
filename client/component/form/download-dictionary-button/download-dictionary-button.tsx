//

import {faDownload, faExclamation, faFileExport} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Badge, BadgeIconbag, Button, ButtonIconbag, GeneralIcon, LoadingIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithUser} from "/client/skeleton";
import {useDownloadDictionary, useDownloadDictionaryFile} from "./download-dictionary-button-hook";


export const DownloadDictionaryButton = create(
  require("../common.scss")
  , "DownloadDictionaryButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DictionaryWithUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("downloadDictionaryButton");

    const {status, keyRef, handleSubmit: handleStartSubmit} = useDownloadDictionary(dictionary);
    const {handleSubmit: handleFileSubmit} = useDownloadDictionaryFile(dictionary, keyRef);

    return (
      <div styleName="button">
        <Button variant="light" onClick={handleStartSubmit} {...rest}>
          <ButtonIconbag><GeneralIcon icon={faFileExport}/></ButtonIconbag>
          {trans("button.start")}
        </Button>
        {(status === "loading") ? (
          <Badge scheme="gray">
            <BadgeIconbag><LoadingIcon/></BadgeIconbag>
            {trans("status.loading")}
          </Badge>
        ) : (status === "success") ? (
          <Button onClick={handleFileSubmit}>
            <ButtonIconbag><GeneralIcon icon={faDownload}/></ButtonIconbag>
            {trans("button.download")}
          </Button>
        ) : (status === "error") ? (
          <Badge scheme="red">
            <BadgeIconbag><GeneralIcon icon={faExclamation}/></BadgeIconbag>
            {trans("status.error")}
          </Badge>
        ) : null}
      </div>
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