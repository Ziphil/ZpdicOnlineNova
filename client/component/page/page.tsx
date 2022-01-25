//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import DictionaryHeader from "/client/component/compound/dictionary-header";
import Footer from "/client/component/compound/footer";
import Header from "/client/component/compound/header";
import PopupInformationPane from "/client/component/compound/popup-information-pane";
import {
  create
} from "/client/component/create";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  StyleNameUtil
} from "/client/util/style-name";


const Page = create(
  require("./page.scss"), "Page",
  function ({
    dictionary = null,
    showDictionary = false,
    showAddLink = false,
    showSettingLink = false,
    children
  }: {
    dictionary?: EnhancedDictionary | null,
    showDictionary?: boolean,
    showAddLink?: boolean,
    showSettingLink?: boolean,
    children?: ReactNode
  }): ReactElement {

    let spacerStyleName = StyleNameUtil.create(
      "spacer",
      {if: showDictionary, true: "dictionary"}
    );
    let dictionaryHeaderNode = (showDictionary) && (
      <DictionaryHeader dictionary={dictionary} showAddLink={showAddLink} showSettingLink={showSettingLink}/>
    );
    let node = (
      <div styleName="root" id="page">
        <PopupInformationPane/>
        <Header/>
        {dictionaryHeaderNode}
        <div styleName={spacerStyleName}>
          <div styleName="content">
            {children}
          </div>
        </div>
        <Footer/>
      </div>
    );
    return node;

  }
);


export default Page;