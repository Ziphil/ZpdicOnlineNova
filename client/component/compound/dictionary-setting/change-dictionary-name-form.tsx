//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./change-dictionary-name-form.scss"))
export class ChangeDictionaryNameForm extends StoreComponent<Props, State> {

  public constructor(props: any) {
    super(props);
    let name = this.props.currentName;
    this.state = {name};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let name = this.state.name;
    let response = await this.requestPost("changeDictionaryName", {number, name});
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
        <Input label="表示名" value={this.state.name} onSet={(name) => this.setState({name})}/>
        <Button label="変更" reactive={true} onClick={this.handleClick.bind(this)}/>
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