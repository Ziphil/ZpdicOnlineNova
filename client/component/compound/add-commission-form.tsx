//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./add-commision-form.scss"))
export default class AddCommissionForm extends Component<Props, State> {

  public state: State = {
    name: "",
    comment: ""
  };

  private async addCommission(): Promise<void> {
    let number = this.props.dictionary!.number;
    let name = this.state.name;
    let comment = this.state.comment;
    let response = await this.requestPost("addCommission", {number, name, comment});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("commissionAdded");
    }
  }

  public render(): ReactNode {
    let node = (this.props.dictionary !== null) && (
      <form styleName="root">
        <Input label={this.trans("addCommissionForm.name")} value={this.state.name} onSet={(name) => this.setState({name})}/>
        <TextArea label={this.trans("addCommissionForm.comment")} value={this.state.comment} onSet={(comment) => this.setState({comment})}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={this.trans("addCommissionForm.confirm")} iconLabel="&#xF022;" style="information" reactive={true} onClick={this.addCommission.bind(this)}/>
          </div>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary | null
};
type State = {
  name: string,
  comment: string
};