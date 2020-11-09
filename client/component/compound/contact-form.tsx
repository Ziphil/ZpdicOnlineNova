//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./contact-form.scss"))
export default class ContactForm extends Component<Props, State> {

  public state: State = {
    name: "",
    email: "",
    subject: "",
    text: ""
  };

  public async componentDidMount(): Promise<void> {
    let user = this.props.store!.user;
    if (user !== null) {
      let name = user.screenName;
      let email = user.email;
      this.setState({name, email});
    }
  }

  private async performSend(): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let subject = this.state.subject;
    let text = this.state.text;
    let response = await this.request("contact", {name, email, subject, text}, {useRecaptcha: true});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("contacted");
      this.setState({text: ""});
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label={this.trans("contactForm.name")} value={this.state.name} showOptional={true} onSet={(name) => this.setState({name})}/>
        <Input label={this.trans("contactForm.email")} value={this.state.email} showOptional={true} onSet={(email) => this.setState({email})}/>
        <Input label={this.trans("contactForm.subject")} value={this.state.subject} showOptional={true} onSet={(subject) => this.setState({subject})}/>
        <TextArea label={this.trans("contactForm.text")} value={this.state.text} onSet={(text) => this.setState({text})}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={this.trans("contactForm.confirm")} iconLabel="&#xF0E0;" style="information" reactive={true} onClick={this.performSend.bind(this)}/>
          </div>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
  name: string,
  email: string,
  subject: string,
  text: string
};