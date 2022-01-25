//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./empty-page.scss"))
export default class EmptyPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <Loading loading={true}/>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};