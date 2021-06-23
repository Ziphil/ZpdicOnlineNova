//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import {
  style
} from "/client/component/decorator";
import {
  DetailedDictionary,
  DictionaryStatistics
} from "/client/skeleton/dictionary";


@style(require("./dictionary-statistics-pane.scss"))
export default class DictionaryStatisticsPane extends Component<Props, State> {

  public state: State = {
    statistics: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.dictionary.number;
    let response = await this.request("fetchDictionaryStatistics", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let statistics = response.data;
      console.log(statistics);
      this.setState({statistics});
    } else {
      this.setState({statistics: null});
    }
  }

  public render(): ReactNode {
    let statistics = this.state.statistics;
    let node = (
      <div styleName="root">
        <Loading loading={this.state.statistics === null}>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.wordCount")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordCountRaw.value", {value: statistics?.wordCount.raw})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordCountRaw.unit", {value: statistics?.wordCount.raw})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordCountTokipona.value", {value: statistics?.wordCount.tokipona})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordCountTokipona.unit", {value: statistics?.wordCount.tokipona})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordCountLogTokipona.value", {value: statistics?.wordCount.logTokipona})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordCountLogTokipona.unit", {value: statistics?.wordCount.logTokipona})}</span>
                </div>
                <div styleName="value-wrapper" style={{display: "none"}}>
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordCountCoverage.value", {value: statistics?.wordCount.coverage})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordCountCoverage.unit", {value: statistics?.wordCount.coverage})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics?.wordNameLengths.average.kept})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics?.wordNameLengths.average.kept})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics?.wordNameLengths.average.nfd})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics?.wordNameLengths.average.nfd})}</span>
                  <span styleName="note">{this.trans("dictionaryStatisticsPane.nfd")}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.value", {value: statistics?.wordNameLengths.average.nfc})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.wordNameLengthAverage.unit", {value: statistics?.wordNameLengths.average.nfc})}</span>
                  <span styleName="note">{this.trans("dictionaryStatisticsPane.nfc")}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.equivalentNameCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.equivalentNameCountWhole.value", {value: statistics?.equivalentNameCount.whole})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.equivalentNameCountWhole.unit", {value: statistics?.equivalentNameCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.equivalentNameCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.equivalentNameCountAverage.value", {value: statistics?.equivalentNameCount.average})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.equivalentNameCountAverage.unit", {value: statistics?.equivalentNameCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.informationCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationCountWhole.value", {value: statistics?.informationCount.whole})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationCountWhole.unit", {value: statistics?.informationCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.informationCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationCountAverage.value", {value: statistics?.informationCount.average})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationCountAverage.unit", {value: statistics?.informationCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics?.informationTextLengths.whole.kept})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics?.informationTextLengths.whole.kept})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics?.informationTextLengths.whole.nfd})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics?.informationTextLengths.whole.nfd})}</span>
                  <span styleName="note">{this.trans("dictionaryStatisticsPane.nfd")}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.value", {value: statistics?.informationTextLengths.whole.nfc})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationTextLengthWhole.unit", {value: statistics?.informationTextLengths.whole.nfc})}</span>
                  <span styleName="note">{this.trans("dictionaryStatisticsPane.nfc")}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics?.informationTextLengths.average.kept})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics?.informationTextLengths.average.kept})}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics?.informationTextLengths.average.nfd})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics?.informationTextLengths.average.nfd})}</span>
                  <span styleName="note">{this.trans("dictionaryStatisticsPane.nfd")}</span>
                </div>
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.value", {value: statistics?.informationTextLengths.average.nfc})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.informationTextLengthAverage.unit", {value: statistics?.informationTextLengths.average.nfc})}</span>
                  <span styleName="note">{this.trans("dictionaryStatisticsPane.nfc")}</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.exampleCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.exampleCountWhole.value", {value: statistics?.exampleCount.whole})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.exampleCountWhole.unit", {value: statistics?.exampleCount.whole})}</span>
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{this.trans("dictionaryStatisticsPane.exampleCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value-wrapper">
                  <span styleName="value">{this.trans("dictionaryStatisticsPane.exampleCountAverage.value", {value: statistics?.exampleCount.average})}</span>
                  <span styleName="unit">{this.trans("dictionaryStatisticsPane.exampleCountAverage.unit", {value: statistics?.exampleCount.average})}</span>
                </div>
              </div>
            </div>
          </div>
        </Loading>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: DetailedDictionary
};
type State = {
  statistics: DictionaryStatistics | null
};