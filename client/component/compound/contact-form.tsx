//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import TextArea from "/client/component/atom/text-area";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest,
  useUser
} from "/client/component/hook";


const ContactForm = create(
  require("./contact-form.scss"), "ContactForm",
  function ({
  }: {
  }): ReactElement {

    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [subject, setSubject] = useState("");
    let [text, setText] = useState("");
    let [, {trans}] = useIntl();
    let [user] = useUser();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let performSend = useCallback(async function (): Promise<void> {
      let response = await request("contact", {name, email, subject, text}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("contacted");
        setSubject("");
        setText("");
      }
    }, [name, email, subject, text, request, addInformationPopup]);

    useMount(() => {
      if (user !== null) {
        let name = user.screenName;
        let email = user.email;
        setName(name);
        setEmail(email);
      }
    });

    let disabled = user !== null;
    let node = (
      <form styleName="root">
        <Input label={trans("contactForm.name")} value={name} disabled={disabled} showOptional={true} onSet={(name) => setName(name)}/>
        <Input label={trans("contactForm.email")} value={email} disabled={disabled} showOptional={true} onSet={(email) => setEmail(email)}/>
        <Input label={trans("contactForm.subject")} value={subject} showOptional={true} onSet={(subject) => setSubject(subject)}/>
        <TextArea label={trans("contactForm.text")} value={text} onSet={(text) => setText(text)}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans("contactForm.confirm")} iconName="envelope" style="information" reactive={true} onClick={performSend}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default ContactForm;