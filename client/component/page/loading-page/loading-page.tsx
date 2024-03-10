/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, LoadingIcon, useTrans} from "zographia";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";


export const LoadingPage = create(
  require("./loading-page.scss"), "LoadingPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("loadingPage");

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main" width="wide">
          <LoadingIcon/>
        </MainContainer>
      </Page>
    );

  }
);
