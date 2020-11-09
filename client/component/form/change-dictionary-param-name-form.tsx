//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  PopupUtil
} from "/client/util/popup";
import {
  IDENTIFIER_REGEXP
} from "/server/model/validation";


@style(require("./change-dictionary-param-name-form.scss"))
export default class ChangeDictionaryParamNameForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let paramName = this.props.currentParamName ?? "";
    this.state = {paramName};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let paramName = this.state.paramName;
    let response = await this.request("changeDictionaryParamName", {number, paramName});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionaryParamNameChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let outerThis = this;
    let nextUrl = "http://zpdic.ziphil.com/dictionary/" + (this.state.paramName || this.props.number);
    let validate = function (value: string): string | null {
      return (value === "" || value.match(IDENTIFIER_REGEXP)) ? null : PopupUtil.getMessage(outerThis.props.intl!, "invalidDictionaryParamName");
    };
    let node = (
      <Fragment>
        <form styleName="root">
          <Input label={this.trans("changeDictionaryParamNameForm.paramName")} value={this.state.paramName} validate={validate} onSet={(paramName) => this.setState({paramName})}/>
          <Button label={this.trans("changeDictionaryParamNameForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
        <p styleName="url">
          {nextUrl}
        </p>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentParamName: string | undefined,
  onSubmit?: () => void
};
type State = {
  paramName: string;
};