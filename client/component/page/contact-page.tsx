//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  ContactForm
} from "/client/component/compound";
import {
  applyStyle,
  intl,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route @intl
@applyStyle(require("./contact-page.scss"))
export class ContactPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">{this.trans("contactPage.description")}</div>
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