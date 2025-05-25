/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditWordForm, useEditWord} from "/client/component/compound/edit-word-form";
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

    const {trans} = useTrans("editWordPage");

    const dictionary = useDictionary();
    const {initialData} = useLoaderData() as EditWordPageLoaderData;

    const formSpec = useEditWord(dictionary, initialData);

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditWordForm dictionary={dictionary} initialData={initialData} formSpec={formSpec}/>
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