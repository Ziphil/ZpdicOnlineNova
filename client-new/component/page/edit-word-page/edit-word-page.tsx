/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {EditWordForm} from "/client-new/component/compound/edit-word-form";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import type {EditWordPageLoaderData} from "./edit-word-page-loader";


export const EditWordPage = create(
  require("./edit-word-page.scss"), "EditWordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {dictionary, word} = useLoaderData() as EditWordPageLoaderData;

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditWordForm dictionary={dictionary} word={word}/>
        </MainContainer>
      </Page>
    );

  }
);