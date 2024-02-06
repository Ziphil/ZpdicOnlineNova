/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";


export const DictionarySettingPage = create(
  require("./dictionary-setting-page.scss"), "DictionarySettingPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingPage");

    const dictionary = useDictionary();

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} tabValue="setting"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <section>
            <h3 styleName="heading">{trans("heading.history")}</h3>
          </section>
        </MainContainer>
      </Page>
    );

  }
);