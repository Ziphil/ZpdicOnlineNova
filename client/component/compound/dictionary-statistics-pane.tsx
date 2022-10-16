//

import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Radio from "/client/component/atom/radio";
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

    const [intl, {trans, transNode}] = useIntl();

    const number = dictionary.number;
    const [statistics] = useSuspenseQuery("fetchDictionaryStatistics", {number});
    const [stringType, setStringType] = useState<"kept" | "nfd" | "nfc">("kept");

    const transExtendedNumber = useCallback((number: number | null, digit?: number) => {
      const options = {minimumFractionDigits: digit, maximumFractionDigits: digit};
      if (number === null) {
        return intl.formatMessage({id: "common.negativeInfinity"});
      } else if (number < 0) {
        return intl.formatMessage({id: "common.negative"}, {value: intl.formatNumber(number, options)});
      } else {
        return intl.formatNumber(number, options);
      }
    }, [intl]);

    const node = (
      <div styleName="root">
        <div styleName="radio-container">
          <RadioGroup name="stringType" value={stringType} onSet={setStringType}>
            <Radio value="kept" label={trans("dictionaryStatisticsPane.kept")}/>
            <Radio value="nfd" label={trans("dictionaryStatisticsPane.nfd")}/>
            <Radio value="nfc" label={trans("dictionaryStatisticsPane.nfc")}/>
          </RadioGroup>
        </div>
        <div styleName="row-container">
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.wordCount")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.wordCountRaw.value", {
                    value: statistics.wordCount.raw,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.wordCountTokipona.value", {
                    value: statistics.wordCount.tokipona,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.wordCountCtwi.value", {
                    value: statistics.wordCount.ctwi,
                    valueString: transExtendedNumber(statistics.wordCount.ctwi, 2),
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.wordNameLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.wordNameLengthAverage.value", {
                    value: statistics.wordNameLengths.average[stringType],
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.equivalentNameCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.equivalentNameCountWhole.value", {
                    value: statistics.equivalentNameCount.whole,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.equivalentNameCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.equivalentNameCountAverage.value", {
                    value: statistics.equivalentNameCount.average,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.informationCountWhole.value", {
                    value: statistics.informationCount.whole,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.informationCountAverage.value", {
                    value: statistics.informationCount.average,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationTextLengthWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.informationTextLengthWhole.value", {
                    value: statistics.informationTextLengths.whole[stringType],
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.informationTextLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.informationTextLengthAverage.value", {
                    value: statistics.informationTextLengths.average[stringType],
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.exampleCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.exampleCountWhole.value", {
                    value: statistics.exampleCount.whole,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("dictionaryStatisticsPane.exampleCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("dictionaryStatisticsPane.exampleCountAverage.value", {
                    value: statistics.exampleCount.average,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
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