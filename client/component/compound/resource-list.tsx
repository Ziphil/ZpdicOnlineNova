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
import {
  Dictionary
} from "/client/skeleton/dictionary";


@style(require("./resource-list.scss"))
export default class ResourceList extends Component<Props, State> {

  private async uploadFile(): Promise<void> {
    let number = this.props.dictionary.number;
    let file = this.state.file;
    if (file) {
      let name = file.name;
      let type = file.type;
      let response = await this.request("fetchUploadResourceUrl", {number, name, type});
      if (response.status === 200 && !("error" in response.data)) {
        let url = response.data.url;
        console.log(url);
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="form">
          <FileInput onSet={(file) => this.setState({file})}/>
          <Button label={this.trans("uploadDictionaryForm.confirm")} reactive={true} onClick={this.uploadFile.bind(this)}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary
};
type State = {
  file: File | null
};