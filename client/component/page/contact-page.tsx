//

import * as react from "react";
import {
  ReactNode
} from "react";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import ContactForm from "/client/component/compound/contact-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./contact-page.scss"))
export default class ContactPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="title">{this.trans("contactPage.title")}</div>
        <div styleName="explanation">
          <p>
            <Markdown source={this.trans("contactPage.privacy")} simple={true}/>
          </p>
          <p>
            <Markdown source={this.trans("contactPage.explanation")} simple={true}/>
          </p>
        </div>
        <div styleName="form">
          <ContactForm/>
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