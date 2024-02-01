/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {UserHeader} from "/client-new/component/compound/user-header";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";


export const UserPage = create(
  require("./user-page.scss"), "UserPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userPage");

    const {name} = useParams();
    const [user] = useSuspenseResponse("fetchOtherUser", {name: name!}, {});

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <UserHeader user={user} tabValue={null}/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <section>
          </section>
        </MainContainer>
      </Page>
    );

  }
);