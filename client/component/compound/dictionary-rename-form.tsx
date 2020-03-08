//

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
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./dictionary-rename-form.scss"))
class DictionaryRenameFormBase extends ComponentBase<Props, State> {

  public state: State = {
    name: ""
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let name = this.state.name;
    let dictionary = await http.post("renameDictionary", {number, name});
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="名称" initialValue={this.props.currentName} onValueChange={(value) => this.setState({name: value})}/>
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

export let DictionaryRenameForm = withRouter(DictionaryRenameFormBase);