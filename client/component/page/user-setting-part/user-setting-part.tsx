//

import {faTriangleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, Callout, CalloutBody, CalloutIconContainer, GeneralIcon, MultiLineText, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ChangeMyAvatarForm} from "/client/component/form/change-my-avatar-form";
import {ChangeMyEmailForm} from "/client/component/form/change-my-email-form";
import {ChangeMyPasswordForm} from "/client/component/form/change-my-password-form";
import {ChangeMyScreenNameForm} from "/client/component/form/change-my-screen-name-form";
import {DiscardMeButton} from "/client/component/form/discard-me-button";
import {useMe} from "/client/hook/auth";


export const UserSettingPart = create(
  require("./user-setting-part.scss"), "UserSettingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userSettingPart");

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
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
          <h3 styleName="heading">{trans("heading.email")}</h3>
          <ChangeMyEmailForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.password")}</h3>
          <ChangeMyPasswordForm me={me}/>
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
    ) : null;

  }
);