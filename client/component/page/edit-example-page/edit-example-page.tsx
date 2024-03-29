/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {EditExampleForm} from "/client/component/compound/edit-example-form";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import type {EditExamplePageLoaderData} from "./edit-example-page-loader";


export const EditExamplePage = create(
  require("./edit-example-page.scss"), "EditExamplePage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const dictionary = useDictionary();
    const {initialData} = useLoaderData() as EditExamplePageLoaderData;

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditExampleForm dictionary={dictionary} initialData={initialData}/>
        </MainContainer>
      </Page>
    );

  }
);