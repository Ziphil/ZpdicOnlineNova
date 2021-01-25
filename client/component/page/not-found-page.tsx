//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./not-found-page.scss"))
export default class NotFoundPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="root">
          <div styleName="icon">&#xF128;</div>
          <div styleName="description">
            {this.trans("notFoundPage.description")}
          </div>
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