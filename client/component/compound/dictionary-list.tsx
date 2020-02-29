//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "../../util/decorator";
import {
  DictionaryPane
} from "../compound";


@applyStyle(require("./dictionary-list.scss"))
export class DictionaryList extends Component<DictionaryListProps, {}> {

  public render(): ReactNode {
    let dictionaryPanes = this.props.dictionaries.map((dictionary) => {
      return <DictionaryPane dictionary={dictionary} key={dictionary.id}/>;
    });
    return (
      <div styleName="dictionary-list">
        {dictionaryPanes}
      </div>
    );
  }

}


type DictionaryListProps = {
  dictionaries: Array<any>
};