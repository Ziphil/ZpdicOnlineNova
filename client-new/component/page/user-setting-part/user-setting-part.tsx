//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {ChangeMyEmailForm} from "/client-new/component/form/change-my-email-form";
import {ChangeMyPasswordForm} from "/client-new/component/form/change-my-password-form";
import {ChangeMyScreenNameForm} from "/client-new/component/form/change-my-screen-name-form";
import {useMe} from "/client-new/hook/auth";


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
          <h3 styleName="heading">{trans("heading.email")}</h3>
          <ChangeMyEmailForm me={me}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.password")}</h3>
          <ChangeMyPasswordForm me={me}/>
        </section>
      </div>
    ) : null;

  }
);