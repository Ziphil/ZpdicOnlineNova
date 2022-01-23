//

import * as react from "react";
import {
  ReactElement
} from "react";
import LanguageForm from "/client/component-function/compound/language-form";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const LanguagePage = create(
  require("./language-page.scss"), "LanguagePage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page>
        <div styleName="title">{trans("languagePage.title")}</div>
        <div styleName="form">
          <LanguageForm/>
        </div>
      </Page>
    );
    return node;

  }
);


export default LanguagePage;