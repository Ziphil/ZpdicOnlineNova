//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Loading from "/client/component/compound/loading";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useRequest
} from "/client/component/hook";
import {
  DetailedDictionary,
  DictionaryStatistics
} from "/client/skeleton/dictionary";


const DictionaryStatisticsPane = create(
  require("./dictionary-statistics-pane.scss"), "DictionaryStatisticsPane",
  function ({
    dictionary
  }: {
    dictionary: DetailedDictionary
  }): ReactElement {

    let [statistics, setStatistics] = useState<DictionaryStatistics | null>(null);
    let [, {trans}] = useIntl();
    let {request} = useRequest();

    useMount(async () => {
      let number = dictionary.number;
      let response = await request("fetchDictionaryStatistics", {number});
      if (response.status === 200 && !("error" in response.data)) {
        let statistics = response.data;
        setStatistics(statistics);
      } else {
        setStatistics(null);
      }
    });

    let wordCountLogTokiponaType = (statistics?.wordCount.logTokipona! === null) ? "Infinity" : (statistics?.wordCount.logTokipona! < 0) ? "Negative" : "Positive";
    let wordCountCtwiType = (statistics?.wordCount.ctwi! === null) ? "Infinity" : (statistics?.wordCount.ctwi! < 0) ? "Negative" : "Positive";
    let node = (
      <div styleName="root">
        <Loading loading={statistics === null}>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.wordCount")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordCountRaw.value", {value: statistics?.wordCount.raw})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordCountRaw.unit", {value: statistics?.wordCount.raw})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordCountTokipona.value", {value: statistics?.wordCount.tokipona})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordCountTokipona.unit", {value: statistics?.wordCount.tokipona})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans(`dictionaryStatisticsPane.wordCountCtwi.value${wordCountCtwiType}`, {value: statistics?.wordCount.ctwi})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordCountCtwi.unit", {value: statistics?.wordCount.ctwi})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.wordNameLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics?.wordNameLengths.average.kept})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics?.wordNameLengths.average.kept})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics?.wordNameLengths.average.nfd})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics?.wordNameLengths.average.nfd})}</span>
                  <span styleName="note">{trans("dictionaryStatisticsPane.nfd")}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics?.wordNameLengths.average.nfc})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics?.wordNameLengths.average.nfc})}</span>
                  <span styleName="note">{trans("dictionaryStatisticsPane.nfc")}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.value", {value: statistics?.equivalentNameCount.whole})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.unit", {value: statistics?.equivalentNameCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.value", {value: statistics?.equivalentNameCount.average})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.unit", {value: statistics?.equivalentNameCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationCountWhole.value", {value: statistics?.informationCount.whole})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationCountWhole.unit", {value: statistics?.informationCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationCountAverage.value", {value: statistics?.informationCount.average})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationCountAverage.unit", {value: statistics?.informationCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationTextLengthWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics?.informationTextLengths.whole.kept})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics?.informationTextLengths.whole.kept})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics?.informationTextLengths.whole.nfd})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics?.informationTextLengths.whole.nfd})}</span>
                  <span styleName="note">{trans("dictionaryStatisticsPane.nfd")}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics?.informationTextLengths.whole.nfc})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics?.informationTextLengths.whole.nfc})}</span>
                  <span styleName="note">{trans("dictionaryStatisticsPane.nfc")}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationTextLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics?.informationTextLengths.average.kept})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics?.informationTextLengths.average.kept})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics?.informationTextLengths.average.nfd})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics?.informationTextLengths.average.nfd})}</span>
                  <span styleName="note">{trans("dictionaryStatisticsPane.nfd")}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics?.informationTextLengths.average.nfc})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics?.informationTextLengths.average.nfc})}</span>
                  <span styleName="note">{trans("dictionaryStatisticsPane.nfc")}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.exampleCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.exampleCountWhole.value", {value: statistics?.exampleCount.whole})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.exampleCountWhole.unit", {value: statistics?.exampleCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.exampleCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.exampleCountAverage.value", {value: statistics?.exampleCount.average})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.exampleCountAverage.unit", {value: statistics?.exampleCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
        </Loading>
      </div>
    );
    return node;

  }
);


export default DictionaryStatisticsPane;