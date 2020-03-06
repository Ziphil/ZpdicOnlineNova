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
  FileInput
} from "/client/component/atom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./dictionary-upload-form.scss"))
class DictionaryUploadFormBase extends ComponentBase<Props, State> {

  public state: State = {
    file: null
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let file = this.state.file;
    if (file) {
      let dictionary = await http.post("dictionaryCreate", {name});
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <FileInput inputLabel="ファイル" buttonLabel="選択" onFileChange={(file) => this.setState({file})}/>
        <Button label="決定" onClick={this.click.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number | string,
  onSubmit?: () => void
};
type State = {
  file: File | null
};

export let DictionaryUploadForm = withRouter(DictionaryUploadFormBase);