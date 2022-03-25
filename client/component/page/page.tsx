//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  Helmet
} from "react-helmet";
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
  DataUtil
} from "/client/util/data";


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

    let spacerData = DataUtil.create({showDictionary});
    let node = (
      <div styleName="root" id="page">
        <Helmet>
          <title>{(title) ? `${title} — ZpDIC Online` : "ZpDIC Online"}</title>
        </Helmet>
        <PopupInformationPane/>
        <Header/>
        {(showDictionary) && (
          <DictionaryHeader dictionary={dictionary} showAddLink={showAddLink} showSettingLink={showSettingLink}/>
        )}
        <div styleName="spacer" {...spacerData}>
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