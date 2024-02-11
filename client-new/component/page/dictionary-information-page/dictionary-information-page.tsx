/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, Suspense} from "react";
import {AdditionalProps, Card, CardBody, MultiLineText, useTrans} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {HistoryChart} from "/client-new/component/compound/history-chart";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {WordNameFrequencyChart} from "/client-new/component/compound/word-name-frequency-chart";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";


export const DictionaryInformationPage = create(
  require("./dictionary-information-page.scss"), "DictionaryInformationPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryInformationPage");

    const dictionary = useDictionary();

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} tabValue="information"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          <section>
            <h3 styleName="heading">{trans("heading.history")}</h3>
            <MultiLineText styleName="description">
              {trans("description.history")}
            </MultiLineText>
            <Suspense>
              <Card>
                <CardBody>
                  <HistoryChart dictionary={dictionary}/>
                </CardBody>
              </Card>
            </Suspense>
          </section>
          <section>
            <h3 styleName="heading">{trans("heading.wordNameFrequency")}</h3>
            <MultiLineText styleName="description">
              {trans("description.wordNameFrequency")}
            </MultiLineText>
            <Suspense>
              <Card>
                <CardBody>
                  <WordNameFrequencyChart dictionary={dictionary}/>
                </CardBody>
              </Card>
            </Suspense>
          </section>
        </MainContainer>
      </Page>
    );

  }
);