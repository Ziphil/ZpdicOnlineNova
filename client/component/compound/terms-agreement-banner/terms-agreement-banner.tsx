//

import {faCheck, faInfoCircle} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {MainContainer} from "/client/component/compound/page/main-container";
import {create} from "/client/component/create";
import {TERMS_DEEMED_CONSENT_DATE} from "/client/constant/terms";
import {useTermsAgreementBanner} from "./terms-agreement-banner-hook";


export const TermsAgreementBanner = create(
  require("./terms-agreement-banner.scss"), "TermsAgreementBanner",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans, transNode, transDate} = useTrans("termsAgreementBanner");

    const {type, handleSubmit} = useTermsAgreementBanner();
    const dateString = transDate(TERMS_DEEMED_CONSENT_DATE.tz("Asia/Tokyo"), "date");

    return (type !== null) ? (
      <div styleName="root" {...rest}>
        <MainContainer styleName="container" width="normal">
          <GeneralIcon styleName="icon" icon={faInfoCircle}/>
          <div styleName="content">
            <MultiLineText is="p">
              {transNode(`message.${type}`, {
                dateString,
                termsLink: (parts) => <Link href="/document/legal/terms" scheme="secondary" variant="underline" target="_blank">{parts}</Link>,
                privacyLink: (parts) => <Link href="/document/legal/privacy" scheme="secondary" variant="underline" target="_blank">{parts}</Link>
              })}
            </MultiLineText>
            <Button styleName="button" variant="light" onClick={handleSubmit}>
              <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
              {trans("button.agree")}
            </Button>
          </div>
        </MainContainer>
      </div>
    ) : null;

  }
);
