//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  DictionaryHeader,
  Footer,
  Header,
  PopupInformationPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./page.scss"))
export class Page extends Component<Props, State> {

  public static defaultProps: Props = {
    showsDictionary: false,
    showsDictionarySetting: false,
    dictionary: null
  };

  public render(): ReactNode {
    let styleNames = ["page"];
    let dictionaryHeaderNode;
    if (this.props.showsDictionary) {
      styleNames.push("dictionary");
      dictionaryHeaderNode = <DictionaryHeader dictionary={this.props.dictionary} showsSetting={this.props.showsDictionarySetting}/>;
    }
    let node = (
      <div styleName="root">
        <Header/>
        <div styleName={styleNames.join(" ")}>
          {dictionaryHeaderNode}
          <PopupInformationPane/>
          <div styleName="content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  showsDictionary: boolean,
  showsDictionarySetting: boolean,
  dictionary: SlimeDictionarySkeleton | null;
};
type State = {
};