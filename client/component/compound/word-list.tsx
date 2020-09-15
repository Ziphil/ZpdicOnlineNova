//

import partial from "lodash-es/partial";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Component from "/client/component/component";
import WordPane from "/client/component/compound/word-pane";
import {
  applyStyle
} from "/client/component/decorator";
import {
  Dictionary,
  EditWord,
  Word
} from "/server/skeleton/dictionary";


@applyStyle(require("./word-list.scss"))
export default class WordList extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showEditLink: false,
    showButton: false
  };

  public render(): ReactNode {
    let displayedWords = this.props.words.slice(this.props.offset, this.props.offset + this.props.size);
    let wordPanes = displayedWords.map((word) => {
      let wordPane = (
        <WordPane
          dictionary={this.props.dictionary}
          word={word}
          key={word.id}
          style={this.props.style}
          showEditLink={this.props.showEditLink}
          showButton={this.props.showButton}
          onSubmit={this.props.onSubmit && partial(this.props.onSubmit, word)}
          onEditConfirm={this.props.onEditConfirm && partial(this.props.onEditConfirm, word)}
          onDeleteConfirm={this.props.onDeleteConfirm && partial(this.props.onDeleteConfirm, word)}
        />
      );
      return wordPane;
    });
    let node = (
      <div styleName="root">
        {wordPanes}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  words: Array<Word>,
  style: "normal" | "simple",
  showEditLink: boolean,
  showButton: boolean,
  size: number,
  offset: number,
  onSubmit?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (oldWord: Word, newWord: EditWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onDeleteConfirm?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void
};
type DefaultProps = {
  style: "normal" | "simple",
  showEditLink: boolean,
  showButton: boolean
};
type State = {
};