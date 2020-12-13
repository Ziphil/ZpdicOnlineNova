//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./add-commission-page.scss"))
export default class AddCommissionPage extends Component<Props, State, Params> {

  public render(): ReactNode {
    let path = "/dictionary/" + this.props.match!.params.number;
    this.replacePath(path, {openCommissionEditor: true});
    return null;
  }

}


type Props = {
};
type State = {
};
type Params = {
  number: string
};