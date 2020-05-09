//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  InvitationPane,
  PaneList
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  Invitation
} from "/server/skeleton/invitation";


@applyStyle(require("./invitation-list.scss"))
export class InvitationList extends Component<Props, State> {

  public render(): ReactNode {
    let renderer = function (invitation: Invitation): ReactNode {
      return <InvitationPane invitation={invitation} key={invitation.id}/>;
    };
    let node = (
      <PaneList items={this.props.invitations} size={this.props.size} renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  invitations: Array<Invitation>,
  size: number
};
type State = {
};