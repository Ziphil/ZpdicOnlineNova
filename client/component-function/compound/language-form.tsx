//

import * as react from "react";
import {
  ReactElement
} from "react";
import RadioGroup from "/client/component-function/atom/radio-group";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  useLocale
} from "/client/component-function/hook";
import {
  LANGUAGES
} from "/client/language";


const LanguageForm = create(
  require("./language-form.scss"), "LanguageForm",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [locale, changeLocale] = useLocale();

    let specs = LANGUAGES.map((language) => ({value: language.locale, label: language.name}));
    let node = (
      <form styleName="root">
        <RadioGroup name="language" value={locale} specs={specs} onSet={(locale) => changeLocale(locale)}/>
        <p styleName="caution">
          {trans("languageForm.caution")}
        </p>
      </form>
    );
    return node;

  }
);


export default LanguageForm;