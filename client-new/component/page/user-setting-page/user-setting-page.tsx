/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {UserHeader} from "/client-new/component/compound/user-header";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";
import {ChangeMyEmailForm} from "./change-my-email-form";
import {ChangeMyPasswordForm} from "./change-my-password-form";
import {ChangeMyScreenNameForm} from "./change-my-screen-name-form";


export const UserSettingPage = create(
  require("./user-setting-page.scss"), "UserSettingPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userSettingPage");

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <UserHeader user={me} tabValue="setting"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
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
        </MainContainer>
      </Page>
    ) : null;

  }
);