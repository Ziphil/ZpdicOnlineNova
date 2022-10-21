//

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
  useMe,
  usePopup,
  useRequest,
  useTrans
} from "/client/component/hook";


const ContactForm = create(
  require("./contact-form.scss"), "ContactForm",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("contactForm");
    const [me] = useMe();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [text, setText] = useState("");

    const performSend = useCallback(async function (): Promise<void> {
      const response = await request("contact", {name, email, subject, text}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("contacted");
        setSubject("");
        setText("");
      }
    }, [name, email, subject, text, request, addInformationPopup]);

    useMount(() => {
      if (me !== null) {
        const name = me.screenName;
        const email = me.email;
        setName(name);
        setEmail(email);
      }
    });

    const disabled = me !== null;
    const node = (
      <form styleName="root">
        <Input label={trans("name")} value={name} disabled={disabled} showOptional={true} onSet={setName}/>
        <Input label={trans("email")} value={email} disabled={disabled} showOptional={true} onSet={setEmail}/>
        <Input label={trans("subject")} value={subject} showOptional={true} onSet={setSubject}/>
        <TextArea label={trans("text")} value={text} onSet={setText}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans("confirm")} iconName="envelope" scheme="blue" reactive={true} onClick={performSend}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default ContactForm;