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
  useSuspenseQuery,
  useTrans
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

    const [intl] = useIntl();
    const {trans, transNode} = useTrans("dictionaryStatisticsPane");

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
            <Radio value="kept" label={trans("kept")}/>
            <Radio value="nfd" label={trans("nfd")}/>
            <Radio value="nfc" label={trans("nfc")}/>
          </RadioGroup>
        </div>
        <div styleName="row-container">
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("wordCount")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("wordCountRaw.value", {
                    value: statistics.wordCount.raw,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
                <div styleName="value">
                  {transNode("wordCountTokipona.value", {
                    value: statistics.wordCount.tokipona,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
                <div styleName="value">
                  {transNode("wordCountCtwi.value", {
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
              <div styleName="title">{trans("wordNameLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("wordNameLengthAverage.value", {
                    value: statistics.wordNameLengths.average[stringType],
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("equivalentNameCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("equivalentNameCountWhole.value", {
                    value: statistics.equivalentNameCount.whole,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("equivalentNameCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("equivalentNameCountAverage.value", {
                    value: statistics.equivalentNameCount.average,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("informationCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("informationCountWhole.value", {
                    value: statistics.informationCount.whole,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("informationCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("informationCountAverage.value", {
                    value: statistics.informationCount.average,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("informationTextLengthWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("informationTextLengthWhole.value", {
                    value: statistics.informationTextLengths.whole[stringType],
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("informationTextLengthAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("informationTextLengthAverage.value", {
                    value: statistics.informationTextLengths.average[stringType],
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="title">{trans("exampleCountWhole.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("exampleCountWhole.value", {
                    value: statistics.exampleCount.whole,
                    unit: (parts) => <span styleName="unit">{parts}</span>
                  })}
                </div>
              </div>
            </div>
            <div styleName="item">
              <div styleName="title">{trans("exampleCountAverage.title")}</div>
              <div styleName="value-list">
                <div styleName="value">
                  {transNode("exampleCountAverage.value", {
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