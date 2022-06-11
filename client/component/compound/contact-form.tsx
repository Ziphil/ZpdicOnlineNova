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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [text, setText] = useState("");
    const [, {trans}] = useIntl();
    const [user] = useUser();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const performSend = useCallback(async function (): Promise<void> {
      const response = await request("contact", {name, email, subject, text}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("contacted");
        setSubject("");
        setText("");
      }
    }, [name, email, subject, text, request, addInformationPopup]);

    useMount(() => {
      if (user !== null) {
        const name = user.screenName;
        const email = user.email;
        setName(name);
        setEmail(email);
      }
    });

    const disabled = user !== null;
    const node = (
      <form styleName="root">
        <Input label={trans("contactForm.name")} value={name} disabled={disabled} showOptional={true} onSet={(name) => setName(name)}/>
        <Input label={trans("contactForm.email")} value={email} disabled={disabled} showOptional={true} onSet={(email) => setEmail(email)}/>
        <Input label={trans("contactForm.subject")} value={subject} showOptional={true} onSet={(subject) => setSubject(subject)}/>
        <TextArea label={trans("contactForm.text")} value={text} onSet={(text) => setText(text)}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans("contactForm.confirm")} iconName="envelope" variant="information" reactive={true} onClick={performSend}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default ContactForm;