/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, useMemo} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {EditWordForm} from "/client-new/component/compound/edit-word-form";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";


export const EditWordPage = create(
  require("./edit-word-page.scss"), "EditWordPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordPage");

    const {identifier} = useParams();
    const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
    const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName}, {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});
    const enhancedDictionary = useMemo(() => EnhancedDictionary.enhance(dictionary), [dictionary]);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={enhancedDictionary} tabValue="dictionary"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <EditWordForm/>
        </MainContainer>
      </Page>
    );

  }
);
