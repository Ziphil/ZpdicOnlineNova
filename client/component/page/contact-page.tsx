//

import * as react from "react";
import {
  ReactElement
} from "react";
import Markdown from "/client/component/atom/markdown";
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

    let [, {trans}] = useIntl();

    let node = (
      <Page title={trans("contactPage.title")}>
        <div styleName="title">{trans("contactPage.title")}</div>
        <div styleName="explanation">
          <p>
            <Markdown source={trans("contactPage.privacy")} simple={true}/>
          </p>
          <p>
            <Markdown source={trans("contactPage.explanation")} simple={true}/>
          </p>
        </div>
        <div styleName="form">
          <ContactForm/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ContactPage;