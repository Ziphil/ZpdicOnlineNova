//

import * as react from "react";
import {
  ReactElement
} from "react";
import Markdown from "/client/component-function/atom/markdown";
import ContactForm from "/client/component-function/compound/contact-form";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const ContactPage = create(
  require("./contact-page.scss"), "ContactPage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page>
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