//

import {faEnvelope, faExclamationCircle} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {Banner, BannerBody, BannerIconContainer} from "/client/component/compound/banner";
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
      <Banner {...rest}>
        <BannerIconContainer><GeneralIcon icon={faExclamationCircle}/></BannerIconContainer>
        <BannerBody>
          <MultiLineText is="p">
            {trans("callout.activate")}
          </MultiLineText>
          <Button styleName="button" variant="light" onClick={issueMyActivateToken}>
            <ButtonIconbag><GeneralIcon icon={faEnvelope}/></ButtonIconbag>
            {trans("button.issueActivateToken")}
          </Button>
        </BannerBody>
      </Banner>
    ) : null;

  }
);
