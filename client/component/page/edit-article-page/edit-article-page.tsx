/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {EditArticleForm} from "/client/component/compound/edit-article-form";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import type {EditArticlePageLoaderData} from "./edit-article-page-loader";


export const EditArticlePage = create(
  require("./edit-article-page.scss"), "EditArticlePage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const dictionary = useDictionary();
    const {initialData} = useLoaderData() as EditArticlePageLoaderData;

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditArticleForm dictionary={dictionary} initialData={initialData}/>
        </MainContainer>
      </Page>
    );

  }
);