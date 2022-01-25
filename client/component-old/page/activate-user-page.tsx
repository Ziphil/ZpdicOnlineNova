//

import * as queryParser from "query-string";
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


@style(require("./activate-user-page.scss"))
export default class ActivateUserPage extends Component<Props, State> {

  public async componentDidMount(): Promise<void> {
    let query = queryParser.parse(this.props.location!.search);
    let key = (typeof query.key === "string") ? query.key : "";
    let response = await this.request("activateUser", {key});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userActivated");
      this.pushPath("/dashboard", undefined, true);
    } else {
      this.pushPath("/", undefined, true);
    }
  }

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