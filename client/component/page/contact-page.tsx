//

import * as react from "react";
import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import ContactForm from "/client/component/compound/contact-form";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const ContactPage = create(
  require("./contact-page.scss"), "ContactPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans, transNode}] = useIntl();

    const node = (
      <Page title={trans("contactPage.title")}>
        <div styleName="title">{trans("contactPage.title")}</div>
        <div styleName="explanation">
          <p>
            {transNode("contactPage.privacy", {
              link: (parts) => <Link href="/document/other/privacy">{parts}</Link>
            })}
          </p>
          <p>
            {trans("contactPage.explanation")}
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