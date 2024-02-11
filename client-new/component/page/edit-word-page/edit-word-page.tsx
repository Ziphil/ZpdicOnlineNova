/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {EditWordForm} from "/client-new/component/compound/edit-word-form";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";
import {useSuspenseResponse} from "/client-new/hook/request";


export const EditWordPage = create(
  require("./edit-word-page.scss"), "EditWordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordPage");

    const {wordNumber} = useParams();
    const dictionary = useDictionary();

    const [word] = useSuspenseResponse("fetchWord", {number: dictionary.number, wordNumber: +wordNumber!}, RESPONSE_CONFIG);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <EditWordForm dictionary={dictionary} word={word}/>
        </MainContainer>
      </Page>
    );

  }
);


const RESPONSE_CONFIG = {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false};