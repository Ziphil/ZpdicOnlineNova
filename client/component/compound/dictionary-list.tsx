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
  DictionaryPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/model/dictionary/slime";


@applyStyle(require("./dictionary-list.scss"))
class DictionaryListBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let dictionaryPanes = this.props.dictionaries.map((dictionary) => {
      return <DictionaryPane dictionary={dictionary} key={dictionary.id}/>;
    });
    let node = (
      <div styleName="dictionary-list">
        {dictionaryPanes}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionaries: Array<SlimeDictionarySkeleton>
};
type State = {
};

export let DictionaryList = withRouter(DictionaryListBase);