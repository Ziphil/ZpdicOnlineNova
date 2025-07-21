//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {WordCardExampleItem} from "/client/component/compound/word-list/word-card-example-item";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/server/internal/skeleton";


export const WordCardExampleList = create(
  require("./word-card-example-list.scss"), "WordCardExampleList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return ("examples" in word && word.examples.length > 0) ? (
      <div styleName="root" {...rest}>
        <section>
          <h4 styleName="heading">
            {dictionary.settings.exampleTitle}
          </h4>
          <ul styleName="list">
            {word.examples.map((example, index) => (
              <WordCardExampleItem key={index} dictionary={dictionary} example={example}/>
            ))}
          </ul>
        </section>
      </div>
    ) : null;

  }
);