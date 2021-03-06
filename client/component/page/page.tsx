//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import DictionaryHeader from "/client/component/compound/dictionary-header";
import Footer from "/client/component/compound/footer";
import Header from "/client/component/compound/header";
import PopupInformationPane from "/client/component/compound/popup-information-pane";
import {
  style
} from "/client/component/decorator";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./page.scss"))
export default class Page extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    dictionary: null,
    showDictionary: false,
    showAddLink: false,
    showSettingLink: false
  };

  public render(): ReactNode {
    let spacerStyleName = StyleNameUtil.create(
      "spacer",
      {if: this.props.showDictionary, true: "dictionary"}
    );
    let dictionaryHeaderNode = (this.props.showDictionary) && (
      <DictionaryHeader dictionary={this.props.dictionary} showAddLink={this.props.showAddLink} showSettingLink={this.props.showSettingLink}/>
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
        <Footer/>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary | null,
  showDictionary: boolean,
  showAddLink: boolean,
  showSettingLink: boolean
};
type DefaultProps = {
  dictionary: EnhancedDictionary | null,
  showDictionary: boolean,
  showAddLink: boolean,
  showSettingLink: boolean
};
type State = {
};