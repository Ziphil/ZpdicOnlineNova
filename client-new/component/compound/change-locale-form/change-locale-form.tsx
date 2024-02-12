/* eslint-disable react/jsx-closing-bracket-location, no-useless-computed-key */

import {faAngleDown, faGlobe} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  GeneralIcon,
  Menu,
  MenuItem,
  useChangeLocale,
  useLocale
} from "zographia";
import {create} from "/client-new/component/create";


export const ChangeLocaleForm = create(
  require("./change-locale-form.scss"), "ChangeLocaleForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const locale = useLocale();
    const changeLocale = useChangeLocale();

    return (
      <Menu styleName="root" triggerType="click" placement="bottom-end" {...rest} trigger={(
        <button styleName="trigger" type="button">
          <GeneralIcon styleName="icon" icon={faGlobe}/>
          <span styleName="locale">{LOCALE_NAMES[locale]}</span>
          <GeneralIcon styleName="angle" icon={faAngleDown}/>
        </button>
      )}>
        {Object.keys(LOCALE_NAMES).map((locale) => (
          <MenuItem styleName="item" key={locale} onClick={() => changeLocale(locale)}>
            <div styleName="name">{LOCALE_NAMES[locale]}</div>
            <div styleName="code">{locale}</div>
          </MenuItem>
        ))}
      </Menu>
    );

  }
);


const LOCALE_NAMES = {
  ["ja"]: "日本語",
  ["en"]: "English",
  ["eo"]: "Esperanto",
  ["isv-Cyrl"]: "Меҗусловјанскы",
  ["isv-Latn"]: "Meǆuslovjansky"
} as Record<string, string>;