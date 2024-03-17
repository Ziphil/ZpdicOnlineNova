//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client/component/atom/logo";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {RegisterForm} from "/client/component/compound/register-form";
import {create} from "/client/component/create";


export const RegisterPage = create(
  require("./register-page.scss"), "RegisterPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("registerPage");

    return (
      <Page styleName="root" title={trans("title")} headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          <div styleName="top">
            <Logo styleName="logo"/>
            <h2 styleName="heading">{trans("heading")}</h2>
          </div>
          <RegisterForm/>
        </MainContainer>
      </Page>
    );

  }
);
