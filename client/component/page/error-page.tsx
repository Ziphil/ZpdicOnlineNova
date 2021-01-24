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


@style(require("./error-page.scss"))
export default class ErrorPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="root">
          Weird
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
  error: any
};
type State = {
};