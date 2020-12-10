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
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/client/skeleton/dictionary";


@style(require("./commission-editor.scss"))
export default class CommissionEditor extends Component<Props, State> {

  public state: State = {
    name: "",
    comment: ""
  };

  private async addCommission(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.dictionary!.number;
    let name = this.state.name;
    let comment = this.state.comment;
    let response = await this.request("addCommission", {number, name, comment}, {useRecaptcha: true});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("commissionAdded");
      if (this.props.onClose) {
        await this.props.onClose(event);
      }
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let node = (
      <Overlay size="large" title={this.trans("commissionEditor.title")} open={this.props.open} onClose={this.props.onClose}>
        <div styleName="root">
          <Input label={this.trans("commissionEditor.name")} value={this.state.name} onSet={(name) => this.setState({name})}/>
          <TextArea className={styles["comment"]} label={this.trans("commissionEditor.comment")} value={this.state.comment} showOptional={true} onSet={(comment) => this.setState({comment})}/>
          <Button className={styles["button"]} label={this.trans("commissionEditor.confirm")} iconLabel="&#xF022;" style="information" reactive={true} onClick={this.addCommission.bind(this)}/>
        </div>
      </Overlay>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  open: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>
};
type State = {
  name: string,
  comment: string
};