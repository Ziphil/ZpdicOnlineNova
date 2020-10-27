//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import LanguageForm from "/client/component/compound/language-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./language-page.scss"))
export default class LanguagePage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">{this.trans("languagePage.description")}</div>
        <div styleName="form">
          <LanguageForm/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};