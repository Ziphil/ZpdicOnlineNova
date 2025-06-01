/* eslint-disable react/jsx-closing-bracket-location, no-useless-computed-key */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableContainer,
  CheckableLabel,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Radio,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {APPEARANCE_FONTS, APPEARANCE_SCHEMES, THEMES} from "/client/constant/appearance";
import {useChangeAppearance} from "./change-appearance-form-hook";


export const ChangeAppearanceForm = create(
  require("../common.scss"), "ChangeAppearanceForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeAppearanceForm");

    const {form, handleSubmit} = useChangeAppearance();
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <ControlLabel>{trans("label.theme.label")}</ControlLabel>
          <div styleName="radio-group">
            {APPEARANCE_SCHEMES.map((scheme) => THEMES.map((theme) => (
              <CheckableContainer key={`${scheme}-${theme}`}>
                <Radio value={`${scheme}-${theme}`} {...register("theme")}/>
                <CheckableLabel>{trans(`label.scheme.${scheme}`)} · {trans(`label.theme.${theme}`)}</CheckableLabel>
              </CheckableContainer>
            )))}
          </div>
          <ControlErrorMessage name="theme" form={form} trans={trans}/>
        </ControlContainer>
        <ControlContainer>
          <ControlLabel>{trans("label.font.label")}</ControlLabel>
          <div styleName="radio-group">
            {APPEARANCE_FONTS.map((font) => (
              <CheckableContainer key={font}>
                <Radio value={font} {...register("font")}/>
                <CheckableLabel>{trans(`label.font.${font}`)}</CheckableLabel>
              </CheckableContainer>
            ))}
          </div>
          <ControlErrorMessage name="font" form={form} trans={trans}/>
        </ControlContainer>
        <div>
          <Button variant="light" type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);
