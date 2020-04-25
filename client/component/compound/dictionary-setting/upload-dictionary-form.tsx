//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  FileInput
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
@applyStyle(require("./upload-dictionary-form.scss"))
export class UploadDictionaryForm extends StoreComponent<Props, State> {

  public state: State = {
    file: null
  };

  private async handleClick(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let file = this.state.file;
    if (file) {
      let response = await this.requestPostFile("uploadDictionary", {number, file});
      if (response.status === 200) {
        this.props.store!.addInformationPopup("dictionaryUploaded");
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
        <Button label="決定" reactive={true} onClick={this.handleClick.bind(this)}/>
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