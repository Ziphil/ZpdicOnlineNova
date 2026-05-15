//

import {faAngleDown, faAngleUp} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo, useState} from "react";
import {AdditionalProps, Button, GeneralIcon, data, useTrans} from "zographia";
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

    const {trans} = useTrans("wordList");

    const [showAll, setShowAll] = useState(false);
    const shownExamples = useMemo(() => ("examples" in word) ? word.examples.slice(0, showAll ? word.examples.length : 3) : [], [word, showAll]);

    const toggleShowAll = useCallback(function (): void {
      setShowAll(!showAll);
    }, [showAll]);

    return ("examples" in word && word.examples.length > 0) ? (
      <div styleName="root" {...rest}>
        <section>
          <h4 styleName="heading">
            {dictionary.settings.exampleTitle}
          </h4>
          <ul styleName="list">
            {shownExamples.map((example, index) => (
              <WordCardExampleItem key={index} dictionary={dictionary} example={example}/>
            ))}
          </ul>
          {(word.examples.length > 3) && (
            <Button styleName="button" scheme="gray" variant="simple" onClick={toggleShowAll}>
              <GeneralIcon styleName="icon" icon={(showAll) ? faAngleUp : faAngleDown} {...data({position: "left"})}/>
              {(showAll) ? trans("exampleListButton.hide") : trans("exampleListButton.show")}
            </Button>
          )}
        </section>
      </div>
    ) : null;

  }
);