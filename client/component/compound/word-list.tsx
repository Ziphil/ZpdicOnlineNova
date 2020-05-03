//

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
  SlimeDictionarySkeleton,
  SlimeEditWordSkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./word-list.scss"))
export class WordList extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    style: "normal",
    showButton: false
  };

  public render(): ReactNode {
    let dictionary = this.props.dictionary;
    let words = this.props.words;
    let displayedWords = words.slice(this.props.offset, this.props.offset + this.props.size);
    let style = this.props.style;
    let authorized = this.props.authorized;
    let showButton = this.props.showButton;
    let wordPanes = displayedWords.map((word) => {
      let outerThis = this;
      let onConfirm = function (event: MouseEvent<HTMLButtonElement>): void {
        if (outerThis.props.onConfirm) {
          outerThis.props.onConfirm(word, event);
        }
      };
      let onEditConfirm = function (newWord: SlimeEditWordSkeleton, event: MouseEvent<HTMLButtonElement>): void {
        if (outerThis.props.onEditConfirm) {
          outerThis.props.onEditConfirm(word, newWord, event);
        }
      };
      return <WordPane dictionary={dictionary} word={word} key={word.id} style={style} authorized={authorized} showButton={showButton} onConfirm={onConfirm} onEditConfirm={onEditConfirm}/>;
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
  dictionary: SlimeDictionarySkeleton,
  words: Array<SlimeWordSkeleton>,
  style: "normal" | "simple",
  authorized: boolean,
  showButton: boolean,
  size: number,
  offset: number,
  onConfirm?: (word: SlimeWordSkeleton, event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (oldWord: SlimeWordSkeleton, newWord: SlimeEditWordSkeleton, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
};