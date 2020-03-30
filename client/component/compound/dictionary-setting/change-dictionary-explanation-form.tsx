//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  TextArea
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
@applyStyle(require("./change-dictionary-explanation-form.scss"))
export class ChangeDictionaryExplanationForm extends StoreComponent<Props, State> {

  public constructor(props: any) {
    super(props);
    let explanation = this.props.currentExplanation;
    this.state = {explanation};
  }

  private async handleClick(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let explanation = this.state.explanation;
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <TextArea label="説明" font="monospace" initialValue={this.props.currentExplanation} onSet={(value) => this.setState({explanation: value})}/>
        <Button label="変更" reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentExplanation: string,
  onSubmit?: () => void
};
type State = {
  explanation: string;
};