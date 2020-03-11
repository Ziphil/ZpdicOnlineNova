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
  FileInput
} from "/client/component/atom";
import {
  StoreComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store")
@applyStyle(require("./upload-dictionary-form.scss"))
class UploadDictionaryFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    file: null
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let file = this.state.file;
    if (file) {
      let response = await this.requestPostFile("uploadDictionary", {number, file});
      if (response.status === 200) {
        if (this.props.onSubmit) {
          this.props.onSubmit();
        }
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <FileInput inputLabel="ファイル" buttonLabel="選択" onSet={(file) => this.setState({file})}/>
        <Button label="決定" onClick={this.click.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  onSubmit?: () => void
};
type State = {
  file: File | null
};

export let UploadDictionaryForm = withRouter(UploadDictionaryFormBase);