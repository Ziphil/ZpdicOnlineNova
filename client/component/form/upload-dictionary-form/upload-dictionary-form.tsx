//

import {faCircleCheck, faExclamation, faLeft} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, GeneralIcon, Link, LinkIconbag, LoadingIcon, MultiLineText, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useUploadDictionaryForm} from "./upload-dictionary-form-hook";


export const UploadDictionaryForm = create(
  require("./upload-dictionary-form.scss"), "UploadDictionaryForm",
  function ({
    id,
    ...rest
  }: {
    id: string,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("uploadDictionaryForm");

    const {identifier} = useParams();
    const {status} = useUploadDictionaryForm(id, identifier ?? "");

    return (
      <div styleName="root" {...rest}>
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
