//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@applyStyle(require("./empty-page.scss"))
export default class EmptyPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div/>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};