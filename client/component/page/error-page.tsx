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


@style(require("./empty-page.scss"))
export default class EmptyPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        {this.props.error}
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