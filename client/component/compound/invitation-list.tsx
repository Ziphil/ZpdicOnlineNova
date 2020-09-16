//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Component from "/client/component/component";
import InvitationPane from "/client/component/compound/invitation-pane";
import PaneList from "/client/component/compound/pane-list";
import {
  style
} from "/client/component/decorator";
import {
  Invitation
} from "/server/skeleton/invitation";


@style(require("./invitation-list.scss"))
export default class InvitationList extends Component<Props, State> {

  public render(): ReactNode {
    let outerThis = this;
    let renderer = function (invitation: Invitation): ReactNode {
      return <InvitationPane invitation={invitation} key={invitation.id} onSubmit={outerThis.props.onSubmit}/>;
    };
    let node = (
      <PaneList items={this.props.invitations} size={this.props.size} renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  invitations: Array<Invitation> | null,
  size: number,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
};