//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Commission
} from "/server/skeleton/commission";


@style(require("./commission-pane.scss"))
export default class CommissionPane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        {this.props.commission.name}
        <div styleName="comment">
          {this.props.commission.comment}
        </div>
        <div styleName="button">
          <Button label={this.trans("commissionPane.delete")} iconLabel="&#xF2ED;" style="simple"/>
          <Button label={this.trans("commissionPane.add")} iconLabel="&#xF067;" style="simple"/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  commission: Commission
};
type State = {
};