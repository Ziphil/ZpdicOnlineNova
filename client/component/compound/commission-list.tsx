//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Component from "/client/component/component";
import CommissionPane from "/client/component/compound/commission-pane";
import PaneList from "/client/component/compound/pane-list";
import {
  style
} from "/client/component/decorator";
import {
  WithSize
} from "/server/controller/type";
import {
  Commission
} from "/server/skeleton/commission";


@style(require("./commission-list.scss"))
export default class CommissionList extends Component<Props, State> {

  public render(): ReactNode {
    let outerThis = this;
    let renderer = function (commission: Commission): ReactNode {
      return <CommissionPane commission={commission} key={commission.id}/>;
    };
    let node = (
      <PaneList items={this.props.commissions} size={this.props.size} column={2} renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  commissions: Array<Commission> | CommissionProvider | null,
  size: number
};
type State = {
};

type CommissionProvider = (offset?: number, size?: number) => Promise<WithSize<Commission>>;