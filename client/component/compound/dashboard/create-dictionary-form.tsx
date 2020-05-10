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
@applyStyle(require("./create-dictionary-form.scss"))
export class CreateDictionaryForm extends StoreComponent<Props, State> {

  public state: State = {
    name: "新規辞書"
  };

  private async handleClick(): Promise<void> {
    let name = this.state.name;
    let response = await this.requestPost("createDictionary", {name});
    if (response.status === 200) {
      let dictionary = response.data;
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
      this.pushPath("/dictionary-setting/" + dictionary.number);
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="名称" value={this.state.name} onSet={(name) => this.setState({name})}/>
        <Button label="作成" reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  onSubmit?: () => void
};
type State = {
  name: string;
};