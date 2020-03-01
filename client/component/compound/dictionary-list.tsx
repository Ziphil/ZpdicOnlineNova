//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  applyStyle
} from "../../util/decorator";
import {
  ComponentBase
} from "../component";
import {
  DictionaryPane
} from "../compound";


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
  dictionaries: Array<any>
};
type State = {
};

export let DictionaryList = withRouter(DictionaryListBase);