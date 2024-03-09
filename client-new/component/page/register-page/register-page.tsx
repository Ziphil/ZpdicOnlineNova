//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {RegisterForm} from "/client-new/component/compound/register-form";
import {create} from "/client-new/component/create";


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
