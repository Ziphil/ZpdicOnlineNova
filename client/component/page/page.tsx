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
  createStyleName
} from "/client/util/style-name";
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
    let spacerStyleName = createStyleName(
      "spacer",
      {if: this.props.showsDictionary, true: "dictionary"}
    );
    let dictionaryHeaderNode = (this.props.showsDictionary) && (
      <DictionaryHeader dictionary={this.props.dictionary} authorized={this.props.showsDictionarySetting}/>
    );
    let node = (
      <div styleName="root" id="page">
        <PopupInformationPane/>
        <Header/>
        {dictionaryHeaderNode}
        <div styleName={spacerStyleName}>
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