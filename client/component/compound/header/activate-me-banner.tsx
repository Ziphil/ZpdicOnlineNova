//

import {faEnvelope, faExclamationCircle} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {UserWithDetail} from "/server/internal/skeleton";
import {useIssueMyActivateToken} from "./activate-me-banner-hook";


export const ActivateMeBanner = create(
  require("./activate-me-banner.scss"), "ActivateMeBanner",
  function ({
    me,
    ...rest
  }: {
    me: UserWithDetail | null,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userHeader");

    const issueMyActivateToken = useIssueMyActivateToken();

    return (me !== null && !me.activated) ? (
      <div styleName="root" {...rest}>
        <MainContainer styleName="container" width="normal">
          <GeneralIcon styleName="icon" icon={faExclamationCircle}/>
          <div styleName="content">
            <MultiLineText is="p">
              {trans("callout.activate")}
            </MultiLineText>
            <Button styleName="button" variant="light" onClick={issueMyActivateToken}>
              <ButtonIconbag><GeneralIcon icon={faEnvelope}/></ButtonIconbag>
              {trans("button.issueActivateToken")}
            </Button>
          </div>
        </MainContainer>
      </div>
    ) : null;

  }
);
