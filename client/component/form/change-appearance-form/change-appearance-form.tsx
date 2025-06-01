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
import {create} from "/client/component/create";
import {APPEARANCE_SCHEMES, THEMES} from "/client/constant/appearance";
import {useChangeAppearance} from "/client/hook/appearance";


export const ChangeAppearanceForm = create(
  require("../common.scss"), "ChangeAppearanceForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeAppearanceForm");

    const changeAppearance = useChangeAppearance();

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <ControlLabel>{trans("label.theme")}</ControlLabel>
          <div styleName="radio-group">
            {APPEARANCE_SCHEMES.map((scheme) => THEMES.map((theme) => (
              <CheckableContainer key={`${scheme}-${theme}`}>
                <Radio value={`${scheme}-${theme}`}/>
                <CheckableLabel>{trans(`scheme.${scheme}`)} · {trans(`theme.${theme}`)}</CheckableLabel>
              </CheckableContainer>
            )))}
          </div>
          {/* <ControlErrorMessage name="currentPassword" form={form} trans={trans}/> */}
        </ControlContainer>
        <ControlContainer>
          <ControlLabel>{trans("label.font")}</ControlLabel>
          {/* <ControlErrorMessage name="newPassword" form={form} trans={trans}/> */}
        </ControlContainer>
        <div>
          <Button variant="light" type="submit">
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);
