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


@style(require("./remove-dictionary-form.scss"))
export default class RemoveDictionaryForm extends Component<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async removeDictionary(): Promise<void> {
    let number = this.props.number;
    let response = await this.request("removeDictionary", {number});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionaryRemoved");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Fragment>
        <form styleName="root">
          <Button label={this.trans("removeDictionaryForm.confirm")} reactive={true} style="caution" onClick={() => this.setState({alertOpen: true})}/>
        </form>
        <p styleName="caution">
          {this.trans("removeDictionaryForm.caution")}
        </p>
        <Alert
          text={this.trans("removeDictionaryForm.alert")}
          confirmLabel={this.trans("removeDictionaryForm.confirm")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.removeDictionary.bind(this)}
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