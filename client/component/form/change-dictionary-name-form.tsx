//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./change-dictionary-name-form.scss"))
export default class ChangeDictionaryNameForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let name = this.props.currentName;
    this.state = {name};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let name = this.state.name;
    let response = await this.request("changeDictionaryName", {number, name});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionaryNameChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label={this.trans("changeDictionaryNameForm.name")} value={this.state.name} onSet={(name) => this.setState({name})}/>
        <Button label={this.trans("changeDictionaryNameForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentName: string,
  onSubmit?: () => void
};
type State = {
  name: string;
};