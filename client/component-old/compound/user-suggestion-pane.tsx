//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  User
} from "/client/skeleton/user";


@style(require("./user-suggestion-pane.scss"))
export default class UserSuggestionPane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="right">
          <div styleName="image"/>
        </div>
        <div styleName="left">
          <span styleName="screen-name">{this.props.user.screenName}</span>
          <span styleName="name">@{this.props.user.name}</span>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  user: User
};
type State = {
};