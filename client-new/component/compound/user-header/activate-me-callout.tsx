//

import {faEnvelope, faInfoCircle} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Callout, CalloutBody, CalloutIconContainer, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useIssueMyActivateToken} from "./activate-me-callout-hook";


export const ActivateMeCallout = create(
  require("./activate-me-callout.scss"), "ActivateMeCallout",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userHeader");

    const issueMyActivateToken = useIssueMyActivateToken();

    return (
      <Callout styleName="callout" {...rest}>
        <CalloutIconContainer><GeneralIcon icon={faInfoCircle}/></CalloutIconContainer>
        <CalloutBody styleName="body">
          <MultiLineText is="p">
            {trans("callout.activate")}
          </MultiLineText>
          <Button styleName="button" variant="light" onClick={issueMyActivateToken}>
            <ButtonIconbag><GeneralIcon icon={faEnvelope}/></ButtonIconbag>
            {trans("button.issueActivateToken")}
          </Button>
        </CalloutBody>
      </Callout>
    );

  }
);


export type UserHeaderTabValue = "dictionary" | "notification" | "setting" | null;