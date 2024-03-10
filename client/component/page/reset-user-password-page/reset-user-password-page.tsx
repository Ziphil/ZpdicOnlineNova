//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client/component/atom/logo";
import {Header} from "/client/component/compound/header";
import {IssueUserResetTokenForm} from "/client/component/compound/issue-user-reset-token-form";
import {MainContainer, Page} from "/client/component/compound/page";
import {ResetUserPasswordForm} from "/client/component/compound/reset-user-password-form";
import {create} from "/client/component/create";
import {useSearch} from "/client/hook/search";


export const ResetUserPasswordPage = create(
  require("./reset-user-password-page.scss"), "ResetUserPasswordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("resetUserPasswordPage");

    const [search] = useSearch();
    const tokenKey = search.get("key");

    return (
      <Page styleName="root" title={trans(`title.${(tokenKey) ? "reset" : "issue"}`)} headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          <div styleName="top">
            <Logo styleName="logo"/>
            <h2 styleName="heading">{trans(`heading.${(tokenKey) ? "reset" : "issue"}`)}</h2>
          </div>
          {(!!tokenKey) ? (
            <ResetUserPasswordForm tokenKey={tokenKey}/>
          ) : (
            <IssueUserResetTokenForm/>
          )}
        </MainContainer>
      </Page>
    );

  }
);
