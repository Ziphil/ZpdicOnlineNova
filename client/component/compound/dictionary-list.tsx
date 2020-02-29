//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import {
  applyStyle
} from "../../util/decorator";
import {
  DictionaryPane
} from "../compound";


@applyStyle(require("./dictionary-list.scss"))
class DictionaryListBase extends Component<RouteComponentProps<{}> & Props, State> {

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