//

import * as react from "react";
import {
  ReactElement,
  ReactNode,
  useState
} from "react";
import {
  Helmet
} from "react-helmet";
import Drawer from "/client/component/atom/drawer";
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
    title,
    dictionary = null,
    showDictionary = false,
    showAddLink = false,
    showSettingLink = false,
    children
  }: {
    title?: string,
    dictionary?: EnhancedDictionary | null,
    showDictionary?: boolean,
    showAddLink?: boolean,
    showSettingLink?: boolean,
    children?: ReactNode
  }): ReactElement {

    let [editerOpen, setEditorOpen] = useState(false);

    let spacerStyleName = StyleNameUtil.create(
      "spacer",
      {if: showDictionary, true: "dictionary"}
    );
    let dictionaryHeaderNode = (showDictionary) && (
      <DictionaryHeader dictionary={dictionary} showAddLink={showAddLink} showSettingLink={showSettingLink}/>
    );
    let node = (
      <div styleName="root" id="page">
        <Helmet>
          <title>{(title) ? `${title} — ZpDIC Online` : "ZpDIC Online"}</title>
        </Helmet>
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