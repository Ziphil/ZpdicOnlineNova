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


@style(require("./change-dictionary-explanation-form.scss"))
export default class ChangeDictionaryExplanationForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let explanation = this.props.currentExplanation ?? "";
    this.state = {explanation};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let explanation = this.state.explanation;
    let response = await this.requestPost("changeDictionaryExplanation", {number, explanation});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionaryExplanationChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <TextArea
          label={this.trans("changeDictionaryExplanationForm.explanation")}
          font="monospace"
          language="markdown"
          nowrap={true}
          value={this.state.explanation}
          onSet={(explanation) => this.setState({explanation})}
        />
        <Button label={this.trans("changeDictionaryExplanationForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentExplanation: string | undefined,
  onSubmit?: () => void
};
type State = {
  explanation: string;
};