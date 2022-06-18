//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  Helmet
} from "react-helmet";
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
    dictionary,
    showDictionary = false,
    showAddLink = false,
    showSettingLink = false,
    children
  }: {
    title?: string,
    dictionary?: EnhancedDictionary,
    showDictionary?: boolean,
    showAddLink?: boolean,
    showSettingLink?: boolean,
    children?: ReactNode
  }): ReactElement {

    const spacerData = DataUtil.create({showDictionary});
    const node = (
      <div styleName="root" id="page">
        <Helmet>
          <title>{(title) ? `${title} — ZpDIC Online` : "ZpDIC Online"}</title>
        </Helmet>
        <PopupInformationPane/>
        <Header dictionary={dictionary} showAddLink={showAddLink} showSettingLink={showSettingLink}/>
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