//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {Header} from "/client-new/component/compound/header";
import {IssueUserResetTokenForm} from "/client-new/component/compound/issue-user-reset-token-form";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {ResetUserPasswordForm} from "/client-new/component/compound/reset-user-password-form";
import {create} from "/client-new/component/create";
import {useSearch} from "/client-new/hook/search";


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
      <Page styleName="root" headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          <div styleName="top">
            <Logo styleName="logo"/>
            <h2 styleName="title">{trans(`title.${tokenKey ? "reset" : "issue"}`)}</h2>
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
