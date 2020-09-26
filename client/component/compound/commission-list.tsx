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
import {
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./commission-list.scss"))
export default class CommissionList extends Component<Props, State> {

  public render(): ReactNode {
    let outerThis = this;
    let renderer = function (commission: Commission): ReactNode {
      let node = (
        <CommissionPane
          commission={commission}
          dictionary={outerThis.props.dictionary}
          key={commission.id}
          onDeleteConfirm={outerThis.props.onDeleteConfirm}
          onAddConfirm={outerThis.props.onAddConfirm}
        />
      );
      return node;
    };
    let node = (
      <PaneList items={this.props.commissions} size={this.props.size} column={3} style="spaced" renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  commissions: Array<Commission> | CommissionProvider | null,
  dictionary: Dictionary
  size: number,
  onDeleteConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onAddConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
};

type CommissionProvider = (offset?: number, size?: number) => Promise<WithSize<Commission>>;