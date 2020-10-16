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
} from "/server/skeleton/dictionary";


@style(require("./change-dictionary-settings-form.scss"))
export default class ChangeDictionarySettingsForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let settings = this.props.currentSettings;
    this.state = {...settings};
  }

  private async handleClick(): Promise<void> {
    let propertyName = this.props.propertyName;
    let number = this.props.number;
    let settings = {[propertyName]: this.state[propertyName]};
    let response = await this.requestPost("changeDictionarySettings", {number, settings});
    if (response.status === 200) {
      let type = (() => {
        if (propertyName === "punctuations") {
          return "dictionaryPunctuationsChanged";
        } else if (propertyName === "pronunciationTitle") {
          return "dictionaryPronunciationTitleChanged";
        } else if (propertyName === "enableMarkdown") {
          return "dictionaryEnableMarkdownChanged";
        } else {
          return "messageNotFound";
        }
      })();
      this.props.store!.addInformationPopup(type);
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  private renderChangePronunciationTitleForm(): ReactNode {
    let node = (
      <form styleName="root input">
        <Input label={this.trans("changeDictionarySettingsForm.pronunciationTitle")} value={this.state.pronunciationTitle} onSet={(pronunciationTitle) => this.setState({pronunciationTitle})}/>
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
    let secretValue = (this.state.enableMarkdown) ? "true" : "false";
    let node = (
      <form styleName="root radio">
        <RadioGroup name="enableMarkdown" specs={specs} value={secretValue} onSet={(value) => this.setState({enableMarkdown: value === "true"})}/>
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
    } else if (propertyName === "enableMarkdown") {
      return this.renderChangeEnableMarkdownForm();
    }
  }

}


type Props = {
  number: number,
  currentSettings: DictionarySettings,
  propertyName: keyof DictionarySettings,
  onSubmit?: () => void
};
type State = {
  punctuations: Array<string>,
  pronunciationTitle: string,
  enableMarkdown: boolean
};