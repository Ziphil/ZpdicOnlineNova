//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  route
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@route
@applyStyle(require("./empty-page.scss"))
export class EmptyPage extends StoreComponent<Props, State> {

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