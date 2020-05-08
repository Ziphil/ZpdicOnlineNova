//

import {
  partial
} from "lodash-es";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  WordPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  DictionarySkeleton,
  EditWordSkeleton,
  WordSkeleton
} from "/server/skeleton/dictionary";


@applyStyle(require("./word-list.scss"))
export class WordList extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    style: "normal",
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
          authorized={this.props.authorized}
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
  dictionary: DictionarySkeleton,
  words: Array<WordSkeleton>,
  style: "normal" | "simple",
  authorized: boolean,
  showButton: boolean,
  size: number,
  offset: number,
  onSubmit?: (word: WordSkeleton, event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (oldWord: WordSkeleton, newWord: EditWordSkeleton, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>,
  onDeleteConfirm?: (word: WordSkeleton, event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};