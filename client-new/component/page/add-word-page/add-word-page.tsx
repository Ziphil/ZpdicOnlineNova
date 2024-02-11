/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, useMemo} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {EditWordForm} from "/client-new/component/compound/edit-word-form";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";


export const AddWordPage = create(
  require("./add-word-page.scss"), "AddWordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addWordPage");

    const {identifier} = useParams();
    const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
    const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName}, RESPONSE_CONFIG);
    const enhancedDictionary = useMemo(() => EnhancedDictionary.enhance(dictionary), [dictionary]);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <EditWordForm dictionary={enhancedDictionary} word={null}/>
        </MainContainer>
      </Page>
    );

  }
);


const RESPONSE_CONFIG = {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false};