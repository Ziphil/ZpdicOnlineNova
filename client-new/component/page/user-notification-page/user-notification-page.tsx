/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {UserHeader} from "/client-new/component/compound/user-header";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";


export const UserNotificationPage = create(
  require("./user-notification-page.scss"), "UserNotificationPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans} = useTrans("userNotificationPage");

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <UserHeader user={me} tabValue="notification"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          UNDER CONSTRUCTION
        </MainContainer>
      </Page>
    ) : null;

  }
);