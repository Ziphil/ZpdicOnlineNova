/* eslint-disable react/jsx-closing-bracket-location, no-useless-computed-key */

import {faAngleDown, faGlobe} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  GeneralIcon,
  Menu,
  MenuItem,
  useChangeLocale,
  useTrans
} from "zographia";
import {create} from "/client/component/create";


export const ChangeLocaleForm = create(
  require("./change-locale-form.scss"), "ChangeLocaleForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeLocaleForm");

    const changeLocale = useChangeLocale();

    return (
      <Menu styleName="root" triggerType="click" placement="bottom-end" {...rest} trigger={(
        <button styleName="trigger" type="button">
          <GeneralIcon styleName="icon" icon={faGlobe}/>
          <span styleName="label">{trans("label")}</span>
          <GeneralIcon styleName="angle" icon={faAngleDown}/>
        </button>
      )}>
        {Object.keys(LOCALE_NAMES).map((locale) => (
          <MenuItem styleName="item" key={locale} onClick={() => changeLocale(locale)}>
            {LOCALE_NAMES[locale]}
          </MenuItem>
        ))}
      </Menu>
    );

  }
);


const LOCALE_NAMES = {
  ["ja"]: "日本語",
  ["eo"]: "Esperanto",
  ["en"]: "English"
} as Record<string, string>;