//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./change-dictionary-source-form.scss"))
export default class ChangeDictionarySourceForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let source = this.props.currentSource ?? "";
    this.state = {source};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let propertyName = this.props.languageName + "Source";
    let settings = {[propertyName]: this.state.source};
    let response = await this.requestPost("changeDictionarySettings", {number, settings});
    if (response.status === 200) {
      this.props.store!.addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <TextArea
          label={this.trans(`changeDictionarySourceForm.${this.props.languageName}`)}
          font="monospace"
          mode={this.props.languageName}
          nowrap={true}
          value={this.state.source}
          onSet={(source) => this.setState({source})}
        />
        <Button label={this.trans("changeDictionarySourceForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentSource: string | undefined,
  languageName: "akrantiain" | "zatlin",
  onSubmit?: () => void
};
type State = {
  source: string;
};