/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {Outlet, useMatch, useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
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

    const {name} = useParams();
    const [user] = useSuspenseResponse("fetchOtherUser", {name: name!});

    const match = useMatch("/user/:name/:tabPath");
    const tabValue = getTabValue(match?.params.tabPath);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <UserHeader user={user} tabValue={tabValue}/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <Outlet/>
        </MainContainer>
      </Page>
    );

  }
);


function getTabValue(tabPath: string | undefined): "dictionary" | "notification" | "setting" | null {
  if (tabPath === undefined) {
    return "dictionary";
  } else if (tabPath === "notifications") {
    return "notification";
  } else if (tabPath === "settings") {
    return "setting";
  } else {
    return null;
  }
}