/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, useMemo} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {HistoryChart} from "/client-new/component/compound/history-chart";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {WordNameFrequencyChart} from "/client-new/component/compound/word-name-frequency-chart";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";


export const DictionaryInformationPage = create(
  require("./dictionary-information-page.scss"), "DictionaryInformationPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryInformationPage");

    const {identifier} = useParams();
    const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
    const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName}, {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});
    const enhancedDictionary = useMemo(() => EnhancedDictionary.enhance(dictionary), [dictionary]);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={enhancedDictionary} tabValue="information"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <section>
            <h3 styleName="heading">{trans("heading.history")}</h3>
            <MultiLineText styleName="description">
              {trans("description.history")}
            </MultiLineText>
            <HistoryChart dictionary={enhancedDictionary}/>
          </section>
          <section>
            <h3 styleName="heading">{trans("heading.wordNameFrequency")}</h3>
            <MultiLineText styleName="description">
              {trans("description.wordNameFrequency")}
            </MultiLineText>
            <WordNameFrequencyChart dictionary={enhancedDictionary}/>
          </section>
        </MainContainer>
      </Page>
    );

  }
);