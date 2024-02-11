//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination, PageSpec} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client-new/skeleton";
import {WordCard} from "./word-card";


export const WordList = create(
  require("./word-list.scss"), "WordList",
  function ({
    dictionary,
    words,
    pageSpec,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    words: Array<Word | DetailedWord>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={words} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(word) => <WordCard key={word.id} dictionary={dictionary} word={word}/>}
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);