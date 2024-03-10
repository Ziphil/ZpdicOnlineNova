/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {EditWordForm} from "/client/component/compound/edit-word-form";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import type {EditWordPageLoaderData} from "./edit-word-page-loader";


export const EditWordPage = create(
  require("./edit-word-page.scss"), "EditWordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const dictionary = useDictionary();
    const {word} = useLoaderData() as EditWordPageLoaderData;

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditWordForm dictionary={dictionary} word={word}/>
        </MainContainer>
      </Page>
    );

  }
);