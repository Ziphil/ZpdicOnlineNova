//

import {faCopy} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement, useCallback} from "react";
import {AdditionalProps, Card, CardBody, GeneralIcon, IconButton, MultiLineText, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useToast} from "/client/hook/toast";
import {copyToClipboard} from "/client/util/clipboard";
import {ApiCredential} from "/server/internal/skeleton";


export const ApiCredentialCard = create(
  require("./api-credential-card.scss"), "ApiCredentialCard",
  function ({
    credential,
    ...rest
  }: {
    credential: ApiCredential,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("apiCredentialList");
    const {dispatchInfoToast} = useToast();

    const copyKey = useCallback(async function (): Promise<void> {
      if (credential.key !== undefined) {
        await copyToClipboard(credential.key);
        dispatchInfoToast(trans("toast.copy"));
      }
    }, [credential.key, trans, dispatchInfoToast]);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {(credential.key !== undefined) ? (
            <div>
              <div styleName="code-container">
                <pre styleName="code">
                  {credential.key}
                </pre>
                <IconButton styleName="code-button" scheme="gray" variant="light" label={trans("button.copy")} onClick={copyKey}>
                  <GeneralIcon icon={faCopy}/>
                </IconButton>
              </div>
              <MultiLineText styleName="caution">
                {trans("caution")}
              </MultiLineText>
            </div>
          ) : (
            <pre styleName="code" data-masked={true}>
              {"•".repeat(40)}
            </pre>
          )}
          <dl styleName="table">
            <dt styleName="table-label">{trans("table.createdDate")}</dt>
            <dd styleName="table-value"><time dateTime={dayjs(credential.createdDate).toISOString()}>{transDate(credential.createdDate)}</time></dd>
          </dl>
        </CardBody>
      </Card>
    );

  }
);
