//

import * as react from "react";
import {
  ChangeEvent,
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./file-input.scss"))
export class FileInput extends Component<Props, State> {

  public state: State = {
    file: null,
    fileName: ""
  };

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let files = event.target.files;
    if (files && files.length > 0) {
      let file = files[0];
      let fileName = file.name;
      this.setState({file, fileName});
      if (this.props.onFileChange) {
        this.props.onFileChange(file);
      }
    }
  }

  public render(): ReactNode {
    let inputLabelNode;
    if (this.props.inputLabel) {
      inputLabelNode = <div styleName="label">{this.props.inputLabel}</div>;
    }
    let node = (
      <div styleName="root">
        <label styleName="input-wrapper">
          {inputLabelNode}
          <input styleName="input" type="text" value={this.state.fileName} readOnly/>
        </label>
        <label styleName="button">
          {this.props.buttonLabel}
          <input styleName="file" type="file" onChange={this.handleChange.bind(this)}/>
        </label>
      </div>
    );
    return node;
  }

}


type Props = {
  inputLabel?: string,
  buttonLabel: string,
  onFileChange?: (file: File | null) => void
};
type State = {
  file: File | null,
  fileName: string
};