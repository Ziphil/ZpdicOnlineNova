/* eslint-disable react/jsx-closing-bracket-location */

import {faCopy, faKey} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, IconButton, MultiLineText, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useToast} from "/client/hook/toast";
import {copyToClipboard} from "/client/util/clipboard";
import {useGenerateMyApiCredential} from "./generate-my-api-credential-form-hook";


export const GenerateMyApiCredentialForm = create(
  require("./generate-my-api-credential-form.scss"), "GenerateMyApiCredentialForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("generateMyApiCredentialForm");
    const {dispatchInfoToast} = useToast();

    const {apiKey, handleSubmit} = useGenerateMyApiCredential();

    const copyCode = useCallback(async function (): Promise<void> {
      if (apiKey !== null) {
        await copyToClipboard(apiKey);
        dispatchInfoToast(trans("toast.copy"));
      }
    }, [apiKey, trans, dispatchInfoToast]);

    return (
      <form styleName="root" {...rest}>
        {(apiKey !== null) && (
          <div>
            <div styleName="code-container">
              <pre styleName="code">
                {apiKey}
              </pre>
              <IconButton styleName="code-button" scheme="gray" variant="light" label={trans("button.copy")} onClick={copyCode}>
                <GeneralIcon icon={faCopy}/>
              </IconButton>
            </div>
            <MultiLineText styleName="caution">
              {trans("caution")}
            </MultiLineText>
          </div>
        )}
        {(apiKey === null) && (
          <div>
            <Button variant="light" type="submit" onClick={handleSubmit}>
              <ButtonIconbag><GeneralIcon icon={faKey}/></ButtonIconbag>
              {trans("button.generate")}
            </Button>
          </div>
        )}
      </form>
    );

  }
);