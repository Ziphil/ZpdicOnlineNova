//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  WordPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./word-list.scss"))
class WordListBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let wordPanes = this.props.words.map((word, index) => {
      return <WordPane word={word} key={index}/>;
    });
    let node = (
      <div styleName="dictionary-list">
        {wordPanes}
      </div>
    );
    return node;
  }

}


type Props = {
  words: Array<any>
};
type State = {
};

export let WordList = withRouter(WordListBase);