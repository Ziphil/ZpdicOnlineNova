/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faEye, faLockKeyhole} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableCard, CheckableCardBody, ControlContainer, GeneralIcon, MultiLineText, Radio, data, useTrans} from "zographia";
import {fakEyeShield} from "/client/component/atom/icon";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
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
          <div styleName="card-group" {...data({vertical: "wide"})}>
            <CheckableCard styleName="card">
              <Radio value="public" {...register("visibility")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">
                    <GeneralIcon styleName="label-icon" icon={faEye}/>
                    {trans("label.public")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.public")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="unlisted" {...register("visibility")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">
                    <GeneralIcon styleName="label-icon" icon={fakEyeShield}/>
                    {trans("label.unlisted")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.unlisted")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="private" {...register("visibility")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">
                    <GeneralIcon styleName="label-icon" icon={faLockKeyhole}/>
                    {trans("label.private")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.private")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
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