//

import * as react from "react";
import {
  Fragment,
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
  Commission
} from "/client/skeleton/commission";
import {
  EditableWord,
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


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
          onDiscardConfirm={outerThis.props.onDiscardConfirm}
          onAddConfirm={outerThis.props.onAddConfirm}
        />
      );
      return node;
    };
    let node = (
      <Fragment>
        <div styleName="normal">
          <PaneList items={this.props.commissions} size={this.props.size} column={3} method="table" style="spaced" border={true} renderer={renderer}/>
        </div>
        <div styleName="smartphone">
          <PaneList items={this.props.commissions} size={this.props.size} column={2} method="table" style="spaced" border={true} renderer={renderer}/>
        </div>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary,
  commissions: Array<Commission> | CommissionProvider | null,
  size: number,
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onAddConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
};

export type CommissionProvider = (offset?: number, size?: number) => Promise<WithSize<Commission>>;