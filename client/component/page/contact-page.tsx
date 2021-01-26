//

import * as react from "react";
import {
  ReactNode
} from "react";
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
          {this.trans("contactPage.explanation")}
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