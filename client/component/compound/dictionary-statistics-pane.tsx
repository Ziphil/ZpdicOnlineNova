//

import * as react from "react";
import {
  ReactElement,
  useState
} from "react";
import RadioGroup from "/client/component/atom/radio-group";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useSuspenseQuery
} from "/client/component/hook";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";


const DictionaryStatisticsPane = create(
  require("./dictionary-statistics-pane.scss"), "DictionaryStatisticsPane",
  function ({
    dictionary
  }: {
    dictionary: DetailedDictionary
  }): ReactElement {

    const [, {trans}] = useIntl();

    const number = dictionary.number;
    const [statistics] = useSuspenseQuery("fetchDictionaryStatistics", {number});
    const [stringType, setStringType] = useState<"kept" | "nfd" | "nfc">("kept");

    const ctwi = statistics.wordCount.ctwi;
    const wordCountCtwiType = (ctwi === null || ctwi === undefined) ? "Infinity" : (ctwi < 0) ? "Negative" : "Positive";
    const specs = [
      {value: "kept", label: trans("dictionaryStatisticsPane.kept")},
      {value: "nfd", label: trans("dictionaryStatisticsPane.nfd")},
      {value: "nfc", label: trans("dictionaryStatisticsPane.nfc")}
    ] as const;
    const node = (
      <div styleName="root">
        <div styleName="radio">
          <RadioGroup name="stringType" value={stringType} specs={specs} onSet={setStringType}/>
        </div>
        <div styleName="row-wrapper">
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.wordCount")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordCountRaw.value", {value: statistics.wordCount.raw})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordCountRaw.unit", {value: statistics.wordCount.raw})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordCountTokipona.value", {value: statistics.wordCount.tokipona})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordCountTokipona.unit", {value: statistics.wordCount.tokipona})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{trans(`dictionaryStatisticsPane.wordCountCtwi.value${wordCountCtwiType}`, {value: statistics.wordCount.ctwi})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordCountCtwi.unit", {value: statistics.wordCount.ctwi})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.wordNameLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics.wordNameLengths.average[stringType]})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics.wordNameLengths.average[stringType]})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.value", {value: statistics.equivalentNameCount.whole})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.unit", {value: statistics.equivalentNameCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.value", {value: statistics.equivalentNameCount.average})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.unit", {value: statistics.equivalentNameCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationCountWhole.value", {value: statistics.informationCount.whole})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationCountWhole.unit", {value: statistics.informationCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationCountAverage.value", {value: statistics.informationCount.average})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationCountAverage.unit", {value: statistics.informationCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationTextLengthWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics.informationTextLengths.whole[stringType]})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics.informationTextLengths.whole[stringType]})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationTextLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics.informationTextLengths.average[stringType]})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics.informationTextLengths.average[stringType]})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.exampleCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.exampleCountWhole.value", {value: statistics.exampleCount.whole})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.exampleCountWhole.unit", {value: statistics.exampleCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.exampleCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{trans("dictionaryStatisticsPane.exampleCountAverage.value", {value: statistics.exampleCount.average})}</span>
                  <span styleName="unit">{trans("dictionaryStatisticsPane.exampleCountAverage.unit", {value: statistics.exampleCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


export default DictionaryStatisticsPane;