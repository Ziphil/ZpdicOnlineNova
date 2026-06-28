/* eslint-disable react/jsx-closing-bracket-location, no-useless-computed-key */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableCard,
  CheckableCardBody,
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
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.theme.label")}</ControlLabel>
          <div styleName="card-group">
            {APPEARANCE_SCHEMES.map((scheme) => THEMES.map((theme) => (
              <CheckableCard styleName="card" key={`${scheme}-${theme}`}>
                <Radio value={`${scheme}-${theme}`} {...register("theme")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans(`label.scheme.${scheme}`)} · {trans(`label.theme.${theme}`)}</div>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            )))}
          </div>
          <ControlErrorMessage name="theme" form={form} trans={trans}/>
        </ControlContainer>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.font.label")}</ControlLabel>
          <div styleName="card-group">
            {APPEARANCE_FONTS.map((font) => (
              <CheckableCard styleName="card" key={font}>
                <Radio value={font} {...register("font")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans(`label.font.${font}`)}</div>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
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
