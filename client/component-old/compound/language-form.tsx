//

import * as react from "react";
import {
  ReactNode
} from "react";
import RadioGroup from "/client/component/atom/radio-group";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  LANGUAGES
} from "/client/language";


@style(require("./language-form.scss"))
export default class LanguageForm extends Component<Props, State> {

  public render(): ReactNode {
    let specs = LANGUAGES.map((language) => ({value: language.locale, label: language.name}));
    let node = (
      <form styleName="root">
        <RadioGroup name="language" value={this.props.store!.locale} specs={specs} onSet={(locale) => this.props.store!.changeLocale(locale)}/>
        <p styleName="caution">
          {this.trans("languageForm.caution")}
        </p>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
};