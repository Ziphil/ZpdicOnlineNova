//

import {faDownload} from "@fortawesome/sharp-regular-svg-icons";
import downloadFile from "js-file-download";
import {ReactElement, useCallback} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useRequest} from "/client-new/hook/request";
import {DetailedDictionary} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


export const DownloadDictionaryButton = create(
  null, "DownloadDictionaryButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    const request = useRequest();

    const downloadDictionary = useCallback(async function (): Promise<void> {
      if (dictionary) {
        const number = dictionary.number;
        const response = await request("downloadDictionary", {number}, {responseType: "blob"});
        switchResponse(response, (data) => {
          const disposition = response.headers["content-disposition"];
          const fileName = getFileName(disposition);
          downloadFile(data, fileName);
        });
      }
    }, [dictionary, request]);

    return (
      <Button scheme="secondary" variant="underline" onClick={downloadDictionary} {...rest}>
        <ButtonIconbag><GeneralIcon icon={faDownload}/></ButtonIconbag>
        {trans("button.download")}
      </Button>
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