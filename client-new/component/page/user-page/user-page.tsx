/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {DictionaryList} from "/client-new/component/compound/dictionary-list";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {UserHeader} from "/client-new/component/compound/user-header";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";
import {useSuspenseResponse} from "/client-new/hook/request";


export const UserPage = create(
  require("./user-page.scss"), "UserPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userPage");

    const me = useMe();

    const {name} = useParams();
    const [user] = useSuspenseResponse("fetchOtherUser", {name: name!});
    const [dictionaries] = useSuspenseResponse("fetchUserDictionaries", {name: name!});

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <UserHeader user={user} tabValue="dictionary" dictionaryCount={dictionaries.length}/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <section>
            <DictionaryList dictionaries={dictionaries} size={20} showChart={true} showAuthority={me?.id === user.id}/>
          </section>
        </MainContainer>
      </Page>
    );

  }
);