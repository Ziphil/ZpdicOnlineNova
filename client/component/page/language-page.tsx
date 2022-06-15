//

import * as react from "react";
import {
  ReactElement
} from "react";
import LanguageForm from "/client/component/compound/language-form";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const LanguagePage = create(
  require("./language-page.scss"), "LanguagePage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();

    const node = (
      <Page title={trans("languagePage.title")}>
        <div styleName="title">{trans("languagePage.title")}</div>
        <div styleName="form-container">
          <LanguageForm/>
        </div>
      </Page>
    );
    return node;

  }
);


export default LanguagePage;