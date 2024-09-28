//

import {faClockRotateLeft} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, useTrans} from "zographia";
import {UserView} from "/client/component/atom/user-view";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, OldWord, Word, WordWithExamples} from "/client/skeleton";


export const WordCardHeader = create(
  require("./word-card-header.scss"), "WordCardHeader",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | OldWord | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transNumber, transDate} = useTrans("wordCard");

    return (
      <div styleName="root" {...rest}>
        {("precedence" in word) && (
          <div styleName="number">
            <GeneralIcon styleName="number-icon" icon={faClockRotateLeft}/>
            {transNumber(word.precedence)}
          </div>
        )}
        <div styleName="main">
          <div styleName="date">
            {transDate(word.updatedDate)}
          </div>
          {(word.updatedUser !== undefined) && (
            <UserView user={{id: word.updatedUser}} variant="simple"/>
          )}
        </div>
      </div>
    );

  }
);