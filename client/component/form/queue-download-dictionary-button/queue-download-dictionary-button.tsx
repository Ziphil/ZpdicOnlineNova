//

import {faFileExport} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
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

    const {handleSubmit} = useQueueDownloadDictionary(dictionary);

    return (
      <div styleName="button">
        <Button variant="light" onClick={handleSubmit} {...rest}>
          <ButtonIconbag><GeneralIcon icon={faFileExport}/></ButtonIconbag>
          {trans("button.start")}
        </Button>
      </div>
    );

  }
);
