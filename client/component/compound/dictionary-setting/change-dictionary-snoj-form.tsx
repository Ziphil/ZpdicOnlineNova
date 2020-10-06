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


@style(require("./change-dictionary-snoj-form.scss"))
export default class ChangeDictionarySnojForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let snoj = this.props.currentSnoj;
    this.state = {snoj};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let snoj = this.state.snoj;
    let response = await this.requestPost("changeDictionarySnoj", {number, snoj});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionarySnojChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <TextArea
          label={this.trans("changeDictionarySnojForm.snoj")}
          font="monospace"
          mode="akrantiain"
          nowrap={true}
          value={this.state.snoj}
          onSet={(snoj) => this.setState({snoj})}
        />
        <Button label={this.trans("changeDictionarySnojForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentSnoj: string,
  onSubmit?: () => void
};
type State = {
  snoj: string;
};