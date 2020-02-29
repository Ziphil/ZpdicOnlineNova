//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Redirect
} from "react-router-dom";
import * as http from "../../util/http";


export class Private extends Component<PrivateProps, {}> {

  public render(): ReactNode {
    let node = this.props.children;
    if (!http.isAuthenticated()) {
      node = (
        <Redirect to={this.props.redirect}/>
      );
    }
    return node;
  }

}


type PrivateProps = {
  redirect: string;
};