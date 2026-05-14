//

import {faCircleCheck, faDownload, faExclamation, faLeft} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, Link, LinkIconbag, LoadingIcon, MultiLineText, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useDownloadDictionary} from "./download-dictionary-form-hook";


export const DownloadDictionaryForm = create(
  require("./download-dictionary-form.scss"), "DownloadDictionaryForm",
  function ({
    id,
    ...rest
  }: {
    id: string,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("downloadDictionaryForm");

    const {identifier} = useParams();
    const {status, handleSubmit} = useDownloadDictionary(id);

    return (
      <div styleName="root">
        <div styleName="top">
          {(status === "processing") ? (
            <LoadingIcon styleName="icon" {...data({status})}/>
          ) : (status === "success") ? (
            <GeneralIcon styleName="icon" icon={faCircleCheck} {...data({status})}/>
          ) : (
            <GeneralIcon styleName="icon" icon={faExclamation} {...data({status})}/>
          )}
          <MultiLineText styleName="message">
            {trans(`message.${status}`)}
          </MultiLineText>
        </div>
        {(status !== "processing") && (
          <div styleName="button">
            {status === "success" && (
              <Button variant="solid" onClick={handleSubmit} {...rest}>
                <ButtonIconbag><GeneralIcon icon={faDownload}/></ButtonIconbag>
                {trans("button.download")}
              </Button>
            )}
            <Link href={`/dictionary/${identifier}/settings/file`} variant="light">
              <LinkIconbag><GeneralIcon icon={faLeft}/></LinkIconbag>
              {trans("button.back")}
            </Link>
          </div>
        )}
      </div>
    );

  }
);