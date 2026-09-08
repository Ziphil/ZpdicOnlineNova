//

import {faUp} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, useTrans} from "zographia";
import {ApplyIncreaseDictionaryLimitDialog} from "/client/component/compound/apply-increase-dictionary-limit-dialog";
import {LimitView} from "/client/component/compound/limit-view";
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

    const {trans} = useTrans("dictionaryLimitsView");

    const [sizes] = useSuspenseResponse("fetchDictionarySizes", {number: dictionary.number});

    return (
      <div styleName="root" {...rest}>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.wordCount")}</ControlLabel>
          <LimitView current={sizes.word} max={dictionary.limits.dictionary.wordCount}/>
        </ControlContainer>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.exampleCount")}</ControlLabel>
          <LimitView current={sizes.example} max={dictionary.limits.dictionary.exampleCount}/>
        </ControlContainer>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.articleCount")}</ControlLabel>
          <LimitView current={sizes.article} max={dictionary.limits.dictionary.articleCount}/>
        </ControlContainer>
        <div styleName="button">
          <ApplyIncreaseDictionaryLimitDialog
            dictionary={dictionary}
            trigger={(
              <Button variant="light">
                <ButtonIconbag><GeneralIcon icon={faUp}/></ButtonIconbag>
                {trans("button.apply")}
              </Button>
            )}
          />
        </div>
      </div>
    );

  }
);
