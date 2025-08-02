//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText} from "zographia";
import {Markdown} from "/client/component/atom/markdown";
import {create} from "/client/component/create";
import {getDictionarySpecialPaths} from "/client/util/dictionary";
import {DictionaryWithExecutors, Section} from "/server/internal/skeleton";
import {WordCardAnchor} from "./word-card-anchor";


export const WordCardInformationList = create(
  require("./word-card-information-list.scss"), "WordCardInformationList",
  function ({
    dictionary,
    section,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    section: Section,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const visibleInformations = useMemo(() => section.informations.filter((information) => !information.hidden), [section.informations]);

    return (visibleInformations.length > 0) ? (
      <div styleName="root" {...rest}>
        {visibleInformations.map((information, index) => (
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

  },
  {memo: true}
);