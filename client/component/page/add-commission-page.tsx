//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Redirect
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./add-commission-page.scss"))
export default class AddCommissionPage extends Component<Props, State, Params> {

  public render(): ReactNode {
    let href = "/dictionary/" + this.props.match!.params.number;
    let node = (
      <Redirect to={href}/>
    );
    return node;
  }

}


type Props = {
};
type State = {
};
type Params = {
  number: string
};