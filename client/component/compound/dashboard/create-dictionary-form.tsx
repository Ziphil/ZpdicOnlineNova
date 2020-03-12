//

import {
  inject
} from "mobx-react";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store")
@applyStyle(require("./create-dictionary-form.scss"))
class CreateDictionaryFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    name: ""
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let name = this.state.name;
    let response = await this.requestPost("createDictionary", {name});
    if (response.status === 200) {
      let dictionary = response.data;
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
      this.pushPath("/dictionary/setting/" + dictionary.number);
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="名称" initialValue="新規辞書" onSet={(value) => this.setState({name: value})}/>
        <Button label="作成" onClick={this.click.bind(this)}/>
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

export let CreateDictionaryForm = withRouter(CreateDictionaryFormBase);