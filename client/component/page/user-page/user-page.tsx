/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, Suspense} from "react";
import {Outlet, useMatch, useParams} from "react-router-dom";
import {AdditionalProps, LoadingIcon} from "zographia";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {UserHeader, UserHeaderTabValue} from "/client/component/compound/user-header";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";


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
      <Page title={user?.screenName} {...rest} headerNode={(
        <Fragment>
          <Header/>
          <UserHeader user={user} tabValue={tabValue}/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <Suspense fallback={(
            <div styleName="loading">
              <LoadingIcon/>
            </div>
          )}>
            <Outlet/>
          </Suspense>
        </MainContainer>
      </Page>
    );

  }
);


function getTabValue(tabPath: string | undefined): UserHeaderTabValue {
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