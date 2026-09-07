//

import {ReactElement} from "react";
import {AdditionalProps, ControlContainer, ControlLabel, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Dictionary} from "/server/internal/skeleton";


export const DictionaryLimitsView = create(
  require("./dictionary-limits-view.scss"), "DictionaryLimitsView",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode, transNumber} = useTrans("dictionaryLimitsView");

    const [sizes] = useSuspenseResponse("fetchDictionarySizes", {number: dictionary.number});

    return (
      <div styleName="root" {...rest}>
        <div styleName="list">
          <ControlContainer label={false}>
            <ControlLabel>{trans("label.wordCount")}</ControlLabel>
            <div styleName="meter-info">
              <div styleName="meter-info-left">
                {transNode("value.wordCount", {
                  current: sizes.word,
                  max: dictionary.limits.dictionary.wordCount,
                  largeNumber: (parts) => <span styleName="large-number">{parts}</span>,
                  smallNumber: (parts) => <span styleName="small-number">{parts}</span>,
                  slash: (parts) => <span styleName="slash">{parts}</span>
                })}
              </div>
              <div styleName="meter-info-right">
                {transNode("percent.wordCount", {
                  percent: sizes.word / dictionary.limits.dictionary.wordCount * 100,
                  number: (parts) => <span styleName="large-number">{parts}</span>,
                  unit: (parts) => <span styleName="unit">{parts}</span>
                })}
              </div>
            </div>
            <div styleName="meter">
              <div styleName="meter-bar" style={{width: `${sizes.word / dictionary.limits.dictionary.wordCount * 100}%`}}/>
            </div>
          </ControlContainer>
          <ControlContainer label={false}>
            <ControlLabel>{trans("label.exampleCount")}</ControlLabel>
            <div styleName="meter-info">
              <div styleName="meter-info-left">
                {transNode("value.exampleCount", {
                  current: sizes.example,
                  max: dictionary.limits.dictionary.exampleCount,
                  largeNumber: (parts) => <span styleName="large-number">{parts}</span>,
                  smallNumber: (parts) => <span styleName="small-number">{parts}</span>,
                  slash: (parts) => <span styleName="slash">{parts}</span>
                })}
              </div>
              <div styleName="meter-info-right">
                {transNode("percent.exampleCount", {
                  percent: sizes.example / dictionary.limits.dictionary.exampleCount * 100,
                  number: (parts) => <span styleName="large-number">{parts}</span>,
                  unit: (parts) => <span styleName="unit">{parts}</span>
                })}
              </div>
            </div>
            <div styleName="meter">
              <div styleName="meter-bar" style={{width: `${sizes.example / dictionary.limits.dictionary.exampleCount * 100}%`}}/>
            </div>
          </ControlContainer>
          <ControlContainer label={false}>
            <ControlLabel>{trans("label.articleCount")}</ControlLabel>
            <div styleName="meter-info">
              <div styleName="meter-info-left">
                {transNode("value.articleCount", {
                  current: sizes.article,
                  max: dictionary.limits.dictionary.articleCount,
                  largeNumber: (parts) => <span styleName="large-number">{parts}</span>,
                  smallNumber: (parts) => <span styleName="small-number">{parts}</span>,
                  slash: (parts) => <span styleName="slash">{parts}</span>
                })}
              </div>
              <div styleName="meter-info-right">
                {transNode("percent.articleCount", {
                  percent: sizes.article / dictionary.limits.dictionary.articleCount * 100,
                  number: (parts) => <span styleName="large-number">{parts}</span>,
                  unit: (parts) => <span styleName="unit">{parts}</span>
                })}
              </div>
            </div>
            <div styleName="meter">
              <div styleName="meter-bar" style={{width: `${sizes.article / dictionary.limits.dictionary.articleCount * 100}%`}}/>
            </div>
          </ControlContainer>
        </div>
      </div>
    );

  }
);
