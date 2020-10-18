//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./delete-dictionary-form.scss"))
export default class DeleteDictionaryForm extends Component<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async deleteDictionary(): Promise<void> {
    let number = this.props.number;
    let response = await this.requestPost("deleteDictionary", {number});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionaryDeleted");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Fragment>
        <form styleName="root">
          <Button label={this.trans("deleteDictionaryForm.confirm")} reactive={true} style="caution" onClick={() => this.setState({alertOpen: true})}/>
        </form>
        <p styleName="caution">
          {this.trans("deleteDictionaryForm.caution")}
        </p>
        <Alert
          text={this.trans("deleteDictionaryForm.alert")}
          confirmLabel={this.trans("deleteDictionaryForm.confirm")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.deleteDictionary.bind(this)}
        />
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  onSubmit?: () => void
};
type State = {
  alertOpen: boolean
};