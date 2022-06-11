//

import partial from "lodash-es/partial";
import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import WordPane from "/client/component/compound/word-pane";
import {
  create
} from "/client/component/create";
import {
  DetailedWord,
  EditableExample,
  EditableWord,
  EnhancedDictionary,
  Word
} from "/client/skeleton/dictionary";


const WordList = create(
  require("./word-list.scss"), "WordList",
  function ({
    dictionary,
    words,
    style = "normal",
    showEditLink = false,
    showButton = false,
    showDirectionButton = false,
    size,
    offset,
    onSubmit,
    onEditConfirm,
    onDiscardConfirm,
    onEditExampleConfirm,
    onDiscardExampleConfirm
  }: {
    dictionary: EnhancedDictionary,
    words: Array<Word | DetailedWord>,
    style?: "normal" | "simple",
    showEditLink?: boolean,
    showButton?: boolean,
    showDirectionButton?: boolean,
    size: number,
    offset: number,
    onSubmit?: (word: Word, direction: "oneway" | "mutual", event?: MouseEvent<HTMLButtonElement>) => void,
    onEditConfirm?: (oldWord: Word, newWord: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardConfirm?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void,
    onEditExampleConfirm?: (word: Word, example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardExampleConfirm?: (word: Word, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    const displayedWords = words.slice(offset, offset + size);
    const wordPanes = displayedWords.map((word) => {
      const wordPane = (
        <WordPane
          dictionary={dictionary}
          word={word}
          key={word.id}
          style={style}
          showEditLink={showEditLink}
          showButton={showButton}
          showDirectionButton={showDirectionButton}
          onSubmit={onSubmit && partial(onSubmit, word)}
          onEditConfirm={onEditConfirm && partial(onEditConfirm, word)}
          onDiscardConfirm={onDiscardConfirm && partial(onDiscardConfirm, word)}
          onEditExampleConfirm={onEditExampleConfirm && partial(onEditExampleConfirm, word)}
          onDiscardExampleConfirm={onDiscardExampleConfirm && partial(onDiscardExampleConfirm, word)}
        />
      );
      return wordPane;
    });
    const node = (
      <div styleName="root">
        {wordPanes}
      </div>
    );
    return node;

  }
);


export default WordList;