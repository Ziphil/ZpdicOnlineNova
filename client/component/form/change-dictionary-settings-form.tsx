//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  DictionarySettings
} from "/client/skeleton/dictionary";


@style(require("./change-dictionary-settings-form.scss"))
export default class ChangeDictionarySettingsForm<N extends keyof DictionarySettings> extends Component<Props<N>, State<N>> {

  public constructor(props: any) {
    super(props);
    let value = this.props.currentSettings[this.props.propertyName];
    this.state = {value};
  }

  private async handleClick(): Promise<void> {
    let propertyName = this.props.propertyName;
    let number = this.props.number;
    let settings = {[propertyName]: this.state.value};
    let response = await this.request("changeDictionarySettings", {number, settings});
    if (response.status === 200) {
      this.props.store!.addInformationPopup(`dictionarySettingsChanged.${propertyName}`);
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  private renderChangePronunciationTitleForm(): ReactNode {
    let node = (
      <form styleName="root input">
        <Input label={this.trans("changeDictionarySettingsForm.pronunciationTitle")} value={this.state.value} onSet={(value) => this.setState({value})}/>
        <Button label={this.trans("changeDictionarySettingsForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

  private renderChangeExampleTitleForm(): ReactNode {
    let node = (
      <form styleName="root input">
        <Input label={this.trans("changeDictionarySettingsForm.exampleTitle")} value={this.state.value} onSet={(value) => this.setState({value})}/>
        <Button label={this.trans("changeDictionarySettingsForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

  private renderChangeEnableMarkdownForm(): ReactNode {
    let specs = [
      {value: "true", label: this.trans("changeDictionarySettingsForm.enableMarkdownTrue")},
      {value: "false", label: this.trans("changeDictionarySettingsForm.enableMarkdownFalse")}
    ];
    let secretValue = (this.state.value) ? "true" : "false";
    let node = (
      <form styleName="root radio">
        <RadioGroup name="enableMarkdown" specs={specs} value={secretValue} onSet={(valueString) => this.setState({value: valueString === "true"})}/>
        <Button label={this.trans("changeDictionarySettingsForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

  public render(): ReactNode {
    let propertyName = this.props.propertyName;
    if (propertyName === "punctuations") {
      return undefined;
    } else if (propertyName === "pronunciationTitle") {
      return this.renderChangePronunciationTitleForm();
    } else if (propertyName === "exampleTitle") {
      return this.renderChangeExampleTitleForm();
    } else if (propertyName === "enableMarkdown") {
      return this.renderChangeEnableMarkdownForm();
    }
  }

}


type Props<N> = {
  number: number,
  currentSettings: DictionarySettings,
  propertyName: N,
  onSubmit?: () => void
};
type State<N> = {
  value: any
};