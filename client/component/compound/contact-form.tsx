//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import TextArea from "/client/component/atom/text-area";
import Component from "/client/component/component";
import FormPane from "/client/component/compound/form-pane";
import {
  style
} from "/client/component/decorator";
import {
  Main
} from "/client/index";


@style(require("./contact-form.scss"))
export default class ContactForm extends Component<Props, State> {

  public state: State = {
    name: "",
    email: "",
    subject: "",
    text: "",
    errorType: null,
    errorStyle: "error"
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
    let recaptchaToken = await grecaptcha.execute(Main.getRecaptchaSite(), {action: "contact"});
    let response = await this.requestPost("contact", {name, email, subject, text, recaptchaToken}, true);
    let body = response.data;
    if (response.status === 200) {
      this.setState({errorType: "contacted", errorStyle: "information"});
    } else if (response.status === 400 && body !== null && "error" in body) {
      this.setState({errorType: body.type, errorStyle: "error"});
    } else {
      this.setState({errorType: "unexpected", errorStyle: "error"});
    }
  }

  public render(): ReactNode {
    let node = (
      <FormPane errorType={this.state.errorType} errorStyle={this.state.errorStyle} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label={this.trans("contactForm.name")} value={this.state.name} onSet={(name) => this.setState({name})}/>
          <Input label={this.trans("contactForm.email")} value={this.state.email} onSet={(email) => this.setState({email})}/>
          <Input label={this.trans("contactForm.subject")} value={this.state.subject} onSet={(subject) => this.setState({subject})}/>
          <TextArea label={this.trans("contactForm.text")} value={this.state.text} onSet={(text) => this.setState({text})}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={this.trans("contactForm.send")} iconLabel="&#xF0E0;" style="information" reactive={true} onClick={this.performSend.bind(this)}/>
            </div>
          </div>
        </form>
      </FormPane>
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
  errorType: string | null,
  errorStyle: "error" | "information"
};