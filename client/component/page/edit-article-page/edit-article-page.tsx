/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditArticleForm, useEditArticle} from "/client/component/compound/edit-article-form";
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

    const {trans} = useTrans("editArticlePage");

    const dictionary = useDictionary();
    const {initialData} = useLoaderData() as EditArticlePageLoaderData;

    const formSpec = useEditArticle(dictionary, initialData);

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditArticleForm dictionary={dictionary} initialData={initialData} formSpec={formSpec}/>
          <div styleName="button">
            <Button onClick={formSpec.handleSubmit}>
              <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
              {trans("button.confirm")}
            </Button>
          </div>
        </MainContainer>
      </Page>
    );

  }
);