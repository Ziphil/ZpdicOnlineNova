//

import {ReactElement, ReactNode, useState} from "react";
import {AdditionalProps, data, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Dictionary} from "/client-new/skeleton";


export const DictionaryStatisticsView = create(
  require("./dictionary-statistics-view.scss"), "DictionaryStatisticsView",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode, transNumber, transShortDate} = useTrans("dictionaryStatisticsView");

    const number = dictionary.number;
    const [statistics] = useSuspenseResponse("fetchDictionaryStatistics", {number});

    const [normalization, setNormalization] = useState<"kept" | "nfd" | "nfc">("kept");

    return (
      <div styleName="root" {...rest}>
        <dl styleName="row">
          <div styleName="item">
            <dt styleName="heading">{trans("heading.word")}</dt>
            <dd styleName="value-container">
              <div styleName="value" {...data({size: "large"})}>
                {transNode("value.word", {value: statistics.wordCount.raw, ...FORMATTER_VALUES})}
              </div>
              <div styleName="value">
                {transNode("value.wordTokipona", {value: statistics.wordCount.tokipona, ...FORMATTER_VALUES})}
              </div>
            </dd>
          </div>
          <div styleName="item">
            <dt styleName="heading">{trans("heading.example")}</dt>
            <dd styleName="value-container">
              <div styleName="value" {...data({size: "large"})}>
                {transNode("value.example", {value: statistics.exampleCount.whole, ...FORMATTER_VALUES})}
              </div>
              <div styleName="value">
                {transNode("value.exampleAverage", {value: statistics.exampleCount.average, ...FORMATTER_VALUES})}
              </div>
            </dd>
          </div>
        </dl>
        <dl styleName="row">
          <div styleName="item">
            <dt styleName="heading">{trans("heading.equivalent")}</dt>
            <dd styleName="value-container">
              <div styleName="value">
                {transNode("value.equivalent", {value: statistics.equivalentNameCount.whole, ...FORMATTER_VALUES})}
              </div>
              <div styleName="value">
                {transNode("value.equivalentAverage", {value: statistics.equivalentNameCount.average, ...FORMATTER_VALUES})}
              </div>
            </dd>
          </div>
          <div styleName="item">
            <dt styleName="heading">{trans("heading.information")}</dt>
            <dd styleName="value-container">
              <div styleName="value">
                {transNode("value.information", {value: statistics.informationCount.whole, ...FORMATTER_VALUES})}
              </div>
              <div styleName="value">
                {transNode("value.informationAverage", {value: statistics.informationCount.average, ...FORMATTER_VALUES})}
              </div>
            </dd>
          </div>
          <div styleName="item">
            <dt styleName="heading">{trans("heading.informationText")}</dt>
            <dd styleName="value-container">
              <div styleName="value">
                {transNode("value.informationText", {value: statistics.informationTextLengths.whole[normalization], ...FORMATTER_VALUES})}
              </div>
              <div styleName="value">
                {transNode("value.informationTextAverage", {value: statistics.informationTextLengths.average[normalization], ...FORMATTER_VALUES})}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    );

  }
);


export const FORMATTER_VALUES = {
  number: (parts) => <span styleName="number">{parts}</span>,
  unit: (parts) => <span styleName="unit">{parts}</span>
} as Record<string, (parts: Array<ReactNode>) => ReactNode>;