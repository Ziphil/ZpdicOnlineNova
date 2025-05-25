/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faEye, faLockKeyhole} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableContainer, CheckableLabel, ControlContainer, GeneralIcon, MultiLineText, Radio, data, useTrans} from "zographia";
import {fakEyeShield} from "/client/component/atom/icon";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {useChangeDictionaryVisibility} from "./change-dictionary-visibility-form-hook";


export const ChangeDictionaryVisibilityForm = create(
  require("../common.scss"), "ChangeDictionaryVisibilityForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryVisibilityForm");

    const {form, handleSubmit} = useChangeDictionaryVisibility(dictionary);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="radio-group" {...data({vertical: "wide"})}>
            <CheckableContainer>
              <Radio value="public" {...register("visibility")}/>
              <CheckableLabel styleName="label">
                <div styleName="label-main">
                  <GeneralIcon styleName="label-icon" icon={faEye}/>
                  {trans("label.public")}
                </div>
                <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.public")}</MultiLineText>
              </CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="unlisted" {...register("visibility")}/>
              <CheckableLabel styleName="label">
                <div styleName="label-main">
                  <GeneralIcon styleName="label-icon" icon={fakEyeShield}/>
                  {trans("label.unlisted")}
                </div>
                <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.unlisted")}</MultiLineText>
              </CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="private" {...register("visibility")}/>
              <CheckableLabel styleName="label">
                <div styleName="label-main">
                  <GeneralIcon styleName="label-icon" icon={faLockKeyhole}/>
                  {trans("label.private")}
                </div>
                <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.private")}</MultiLineText>
              </CheckableLabel>
            </CheckableContainer>
          </div>
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