//

import * as react from "react";
import {
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
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./word-list.scss"))
export class WordList extends Component<Props, State> {

  public render(): ReactNode {
    let words = this.props.words;
    let displayedWords = words.slice(this.props.offset, this.props.offset + this.props.size);
    let wordPanes = displayedWords.map((word) => {
      return <WordPane word={word} key={word.id}/>;
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
  words: Array<SlimeWordSkeleton>
  size: number,
  offset: number
};
type State = {
};