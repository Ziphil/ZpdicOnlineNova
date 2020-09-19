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
} from "/server/skeleton/user";


@style(require("./user-suggestion-pane.scss"))
export default class UserSuggestionPane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="right">
          <div styleName="image"/>
        </div>
        <div styleName="left">
          <div styleName="screen-name">{this.props.user.screenName}</div>
          <div styleName="name">@{this.props.user.name}</div>
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