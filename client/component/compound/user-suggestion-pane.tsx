//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  User
} from "/client/skeleton/user";


const UserSuggestionPane = create(
  require("./user-suggestion-pane.scss"), "UserSuggestionPane",
  function ({
    user
  }: {
    user: User
  }): ReactElement {

    const node = (
      <div styleName="root">
        <div styleName="right">
          <div styleName="image"/>
        </div>
        <div styleName="left">
          <span styleName="screen-name">{user.screenName}</span>
          <span styleName="name">@{user.name}</span>
        </div>
      </div>
    );
    return node;

  }
);


export default UserSuggestionPane;