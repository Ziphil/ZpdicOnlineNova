/* eslint-disable react/jsx-closing-bracket-location, no-useless-computed-key */

import {faAngleDown, faPalette} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  GeneralIcon,
  Menu,
  MenuItem,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {APPEARANCE_SCHEMES, THEMES} from "/client/constant/appearance";
import {useChangeAppearance} from "/client/hook/appearance";


export const ChangeAppearanceForm = create(
  require("./change-appearance-form.scss"), "ChangeAppearanceForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeAppearanceForm");

    const changeAppearance = useChangeAppearance();

    return (
      <Menu styleName="root" triggerType="click" placement="bottom-end" {...rest} trigger={(
        <button styleName="trigger" type="button">
          <GeneralIcon styleName="icon" icon={faPalette}/>
          <span styleName="label">{trans("label")}</span>
          <GeneralIcon styleName="angle" icon={faAngleDown}/>
        </button>
      )}>
        {APPEARANCE_SCHEMES.map((appearance) => THEMES.map((theme) => (
          <MenuItem styleName="item" key={`${appearance}-${theme}`}>
            {trans(`appearance.${appearance}`)} · {trans(`theme.${theme}`)}
          </MenuItem>
        )))}
      </Menu>
    );

  }
);
