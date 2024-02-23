//

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
  data
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

    const node = (
      <div styleName="root" id="page">
        <Helmet>
          <title>{(title) ? `${title} — ZpDIC Online` : "ZpDIC Online"}</title>
        </Helmet>
        <PopupInformationPane/>
        <Header dictionary={dictionary} showAddLink={showAddLink} showSettingLink={showSettingLink}/>
        <div styleName="spacer" {...data({showDictionary})}>
          <div styleName="info">
            <p styleName="info-message">
              ZpDIC Online は今年中に全面リニューアルを予定しています。
              リニューアル後に使われる新しいデザインのベータ版を公開中です。
              ぜひお試しください!
            </p>
            <a styleName="info-link" href="/next" target="_blank">
              ベータ版を試す
            </a>
          </div>
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