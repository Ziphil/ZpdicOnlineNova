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

  public static defaultProps: Partial<Props> = {
    showUser: true,
    showUpdatedDate: true,
    showDownloadLink: false
  };

  public render(): ReactNode {
    let outerThis = this;
    let renderer = function (dictionary: Dictionary): ReactNode {
      let dictionaryNode = (
        <DictionaryPane
          dictionary={dictionary}
          key={dictionary.id}
          showUser={outerThis.props.showUser}
          showUpdatedDate={outerThis.props.showUpdatedDate}
          showDownloadLink={outerThis.props.showDownloadLink}
        />
      );
      return dictionaryNode;
    };
    let node = (
      <PaneList items={this.props.dictionaries} size={this.props.size} renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  dictionaries: Array<Dictionary>,
  showUser: boolean,
  showUpdatedDate: boolean,
  showDownloadLink: boolean
  size: number
};
type State = {
};