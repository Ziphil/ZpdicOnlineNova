//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client/component/atom/logo";
import {Header} from "/client/component/compound/header";
import {LoginForm} from "/client/component/compound/login-form";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";


export const LoginPage = create(
  require("./login-page.scss"), "LoginPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("loginPage");

    return (
      <Page styleName="root" title={trans("title")} headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          <div styleName="top">
            <Logo styleName="logo"/>
            <h2 styleName="heading">{trans("heading")}</h2>
          </div>
          <LoginForm/>
        </MainContainer>
      </Page>
    );

  }
);
