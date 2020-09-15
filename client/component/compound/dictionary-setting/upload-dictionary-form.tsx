//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import FileInput from "/client/component/atom/file-input";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./upload-dictionary-form.scss"))
export default class UploadDictionaryForm extends Component<Props, State> {

  public state: State = {
    file: null
  };

  private async handleClick(): Promise<void> {
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
        <FileInput inputLabel={this.trans("uploadDictionaryForm.file")} onSet={(file) => this.setState({file})}/>
        <Button label={this.trans("uploadDictionaryForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
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