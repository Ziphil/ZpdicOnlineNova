//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  DictionaryPane,
  PaneList
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";


@applyStyle(require("./dictionary-list.scss"))
export class DictionaryList extends Component<Props, State> {

  public render(): ReactNode {
    let showsSetting = this.props.showsSetting;
    let renderer = function (dictionary: Dictionary): ReactNode {
      return <DictionaryPane dictionary={dictionary} showsSetting={showsSetting} key={dictionary.id}/>;
    };
    let node = (
      <PaneList items={this.props.dictionaries} size={this.props.size} renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  dictionaries: Array<Dictionary>,
  showsSetting: boolean,
  size: number
};
type State = {
};