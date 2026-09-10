//

import {faTriangleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useOutletContext} from "react-router";
import {AdditionalProps, Callout, CalloutBody, CalloutIconContainer, GeneralIcon, MultiLineText, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ChangeMyAvatarForm} from "/client/component/form/change-my-avatar-form";
import {ChangeMyEmailForm} from "/client/component/form/change-my-email-form";
import {ChangeMyPasswordForm} from "/client/component/form/change-my-password-form";
import {ChangeMyScreenNameForm} from "/client/component/form/change-my-screen-name-form";
import {ChangeMySocialsForm} from "/client/component/form/change-my-socials-form";
import {DiscardMeButton} from "/client/component/form/discard-me-button";
import {LogoutButton} from "/client/component/form/logout-button";
import {UserWithDetail} from "/server/internal/skeleton";


export const UserSettingGeneralPart = create(
  require("./user-setting-general-part.scss"), "UserSettingGeneralPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userSettingGeneralPart");

    const {me} = useOutletContext<{me: UserWithDetail}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.screenName")}</h3>
          <ChangeMyScreenNameForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.avatar")}</h3>
          <ChangeMyAvatarForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.socials")}</h3>
          <ChangeMySocialsForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.email")}</h3>
          <ChangeMyEmailForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.password")}</h3>
          <ChangeMyPasswordForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.logout")}</h3>
          <LogoutButton/>
        </section>
        <section styleName="section">
          <h3 styleName="heading" {...data({danger: true})}>{trans("heading.discard")}</h3>
          <Callout styleName="callout" scheme="red">
            <CalloutIconContainer><GeneralIcon icon={faTriangleExclamation}/></CalloutIconContainer>
            <CalloutBody>
              <MultiLineText is="p">
                {trans("callout.discard")}
              </MultiLineText>
            </CalloutBody>
          </Callout>
          <DiscardMeButton/>
        </section>
      </div>
    );

  }
);