/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";


export const UserPage = create(
  require("./user-page.scss"), "UserPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userPage");

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
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