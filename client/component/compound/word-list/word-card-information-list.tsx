//

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText} from "zographia";
import {Markdown} from "/client/component/atom/markdown";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";
import {getDictionarySpecialPaths} from "/client/util/dictionary";
import {WordCardAnchor} from "./word-card-anchor";


export const WordCardInformationList = create(
  require("./word-card-information-list.scss"), "WordCardInformationList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return (word.informations.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.informations.map((information, index) => (
          <section key={index}>
            {(!!information.title) && (
              <h4 styleName="heading">
                {information.title}
              </h4>
            )}
            {(dictionary.settings.enableMarkdown) ? (
              <Markdown
                styleName="markdown"
                mode="normal"
                compact={true}
                specialPaths={getDictionarySpecialPaths(dictionary)}
                components={{
                  a: (props) => <WordCardAnchor dictionary={dictionary} {...props}/>
                }}
              >
                {information.text}
              </Markdown>
            ) : (
              <MultiLineText styleName="text">
                {information.text}
              </MultiLineText>
            )}
          </section>
        ))}
      </div>
    ) : null;

  }
);