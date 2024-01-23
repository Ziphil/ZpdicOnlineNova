/* eslint-disable react/jsx-closing-bracket-location */

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
          {LOCALE_NAMES[locale]}
          <GeneralIcon styleName="angle" icon={faAngleDown}/>
        </button>
      )}>
        <MenuItem onClick={() => changeLocale("ja")}>{LOCALE_NAMES["ja"]}</MenuItem>
        <MenuItem onClick={() => changeLocale("en")}>{LOCALE_NAMES["en"]}</MenuItem>
        <MenuItem onClick={() => changeLocale("eo")}>{LOCALE_NAMES["eo"]}</MenuItem>
        <MenuItem onClick={() => changeLocale("isv")}>{LOCALE_NAMES["isv"]}</MenuItem>
      </Menu>
    );

  }
);


const LOCALE_NAMES = {
  ja: "日本語",
  en: "English",
  eo: "Esperanto",
  isv: "Меҗусловјанскы"
} as Record<string, string>;