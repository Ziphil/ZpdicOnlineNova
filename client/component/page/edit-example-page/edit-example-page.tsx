/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useLoaderData} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditExampleForm, useEditExample} from "/client/component/compound/edit-example-form";
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

    const {trans} = useTrans("editExamplePage");

    const dictionary = useDictionary();
    const {initialData} = useLoaderData() as EditExamplePageLoaderData;

    const formSpec = useEditExample(dictionary, initialData);

    return (
      <Page {...rest} headerNode={<Header/>}>
        <MainContainer styleName="main">
          <EditExampleForm dictionary={dictionary} initialData={initialData} formSpec={formSpec}/>
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