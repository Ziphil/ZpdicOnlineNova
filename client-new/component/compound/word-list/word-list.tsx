//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client-new/skeleton";
import {WordCard} from "./word-card";


export const WordList = create(
  require("./word-list.scss"), "WordList",
  function ({
    dictionary,
    words,
    size,
    hitSize,
    page,
    onPageSet,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    words: Array<Word | DetailedWord>,
    size: number,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={words} size={size} hitSize={hitSize} page={page} onPageSet={onPageSet} {...rest}>
        <ListBody styleName="body">
          {(word) => <WordCard key={word.id} dictionary={dictionary} word={word}/>}
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);