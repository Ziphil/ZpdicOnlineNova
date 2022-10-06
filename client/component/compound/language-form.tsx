//

import * as react from "react";
import {
  ReactElement
} from "react";
import Radio from "/client/component/atom/radio";
import RadioGroup from "/client/component/atom/radio-group";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useLocale
} from "/client/component/hook";
import {
  LANGUAGES
} from "/client/language";


const LanguageForm = create(
  require("./language-form.scss"), "LanguageForm",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [locale, changeLocale] = useLocale();

    const node = (
      <form styleName="root">
        <RadioGroup name="language" value={locale} onSet={(locale) => changeLocale(locale)}>
          {LANGUAGES.map((language) => <Radio key={language.locale} value={language.locale} label={language.name}/>)}
        </RadioGroup>
        <p styleName="caution">
          {trans("languageForm.caution")}
        </p>
      </form>
    );
    return node;

  }
);


export default LanguageForm;