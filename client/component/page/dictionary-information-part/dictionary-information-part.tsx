//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, MultiLineText, useTrans} from "zographia";
import {DictionaryStatisticsView} from "/client/component/compound/dictionary-statistics-view";
import {HistoryChart} from "/client/component/compound/history-chart";
import {WordNameFrequencyChart} from "/client/component/compound/word-name-frequency-chart";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";


export const DictionaryInformationPart = create(
  require("./dictionary-information-part.scss"), "DictionaryInformationPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryInformationPart");

    const dictionary = useDictionary();

    return (
      <div styleName="root" {...rest}>
        <section>
          <DictionaryStatisticsView dictionary={dictionary}/>
        </section>
        <hr styleName="separator"/>
        <section>
          <h3 styleName="heading">{trans("heading.history")}</h3>
          <MultiLineText styleName="description">
            {trans("description.history")}
          </MultiLineText>
          <Card>
            <CardBody>
              <HistoryChart dictionary={dictionary}/>
            </CardBody>
          </Card>
        </section>
        <section>
          <h3 styleName="heading">{trans("heading.wordNameFrequency")}</h3>
          <MultiLineText styleName="description">
            {trans("description.wordNameFrequency")}
          </MultiLineText>
          <Card>
            <CardBody>
              <WordNameFrequencyChart dictionary={dictionary}/>
            </CardBody>
          </Card>
        </section>
      </div>
    );

  }
);