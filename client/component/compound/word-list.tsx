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
    let wordPanes = displayedWords.map((word) => {
      let outerThis = this;
      let onConfirm = function (event: MouseEvent<HTMLButtonElement>): void {
        if (outerThis.props.onConfirm) {
          outerThis.props.onConfirm(word, event);
        }
      };
      return <WordPane dictionary={dictionary} word={word} key={word.id} style={this.props.style} authorized={this.props.authorized} showButton={this.props.showButton} onConfirm={onConfirm}/>;
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
  onConfirm?: (word: SlimeWordSkeleton, event: MouseEvent<HTMLButtonElement>) => void;
};
type State = {
};