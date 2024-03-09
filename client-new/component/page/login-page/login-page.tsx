//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {Header} from "/client-new/component/compound/header";
import {LoginForm} from "/client-new/component/compound/login-form";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";


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
