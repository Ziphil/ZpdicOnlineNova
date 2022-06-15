//

import * as react from "react";
import {
  ReactElement
} from "react";
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

    const specs = LANGUAGES.map((language) => ({value: language.locale, label: language.name}));
    const node = (
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