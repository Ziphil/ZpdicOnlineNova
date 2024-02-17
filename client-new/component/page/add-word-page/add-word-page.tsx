/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {EditWordForm} from "/client-new/component/compound/edit-word-form";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";


export const AddWordPage = create(
  require("./add-word-page.scss"), "AddWordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addWordPage");

    const dictionary = useDictionary();

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <EditWordForm dictionary={dictionary} word={null}/>
        </MainContainer>
      </Page>
    );

  }
);