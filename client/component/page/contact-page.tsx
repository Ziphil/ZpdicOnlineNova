//

import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import ContactForm from "/client/component/compound/contact-form";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";
import Page from "/client/component/page/page";


const ContactPage = create(
  require("./contact-page.scss"), "ContactPage",
  function ({
  }: {
  }): ReactElement {

    const {trans, transNode} = useTrans("contactPage");

    const node = (
      <Page title={trans("title")}>
        <div styleName="title">{trans("title")}</div>
        <div styleName="explanation">
          <p>
            {transNode("privacy", {link: (parts) => <Link href="/document/other/privacy">{parts}</Link>})}
          </p>
          <p>
            {trans("explanation")}
          </p>
        </div>
        <div styleName="form-container">
          <ContactForm/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ContactPage;