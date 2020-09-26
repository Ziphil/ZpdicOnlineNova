//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Commission
} from "/server/skeleton/commission";
import {
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./commission-pane.scss"))
export default class CommissionPane extends Component<Props, State> {

  private async deleteCommission(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let id = this.props.commission.id;
    let response = await this.requestPost("deleteCommission", {number, id});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("commissionDeleted");
      if (this.props.onDeleteConfirm) {
        await this.props.onDeleteConfirm(event);
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        {this.props.commission.name}
        <div styleName="comment">
          {this.props.commission.comment}
        </div>
        <div styleName="button">
          <Button label={this.trans("commissionPane.delete")} iconLabel="&#xF2ED;" style="simple" onClick={(event) => this.deleteCommission(event)}/>
          <Button label={this.trans("commissionPane.add")} iconLabel="&#xF067;" style="simple"/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  commission: Commission,
  dictionary: Dictionary,
  onDeleteConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onAddConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
};