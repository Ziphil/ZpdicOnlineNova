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
@applyStyle(require("./change-dictionary-name-form.scss"))
class ChangeDictionaryNameFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    name: ""
  };

  public constructor(props: any) {
    super(props);
    let name = this.props.currentName;
    this.state = {name};
  }

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let name = this.state.name;
    let response = await this.requestPost("changeDictionaryName", {number, name});
    if (response.status === 200) {
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="名称" initialValue={this.props.currentName} onSet={(value) => this.setState({name: value})}/>
        <Button label="変更" onClick={this.click.bind(this)}/>
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

export let ChangeDictionaryNameForm = withRouter(ChangeDictionaryNameFormBase);