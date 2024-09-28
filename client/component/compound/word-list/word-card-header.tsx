//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {UserView} from "/client/component/atom/user-view";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";


export const WordCardHeader = create(
  require("./word-card-header.scss"), "WordCardHeader",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transDate} = useTrans("wordCard");

    return (
      <div styleName="root" {...rest}>
        <div styleName="date">
          {transDate(word.updatedDate)}
        </div>
        {(word.updatedUser !== undefined) && (
          <UserView user={{id: word.updatedUser}} variant="simple"/>
        )}
      </div>
    );

  }
);