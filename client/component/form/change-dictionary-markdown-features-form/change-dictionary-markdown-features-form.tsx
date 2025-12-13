/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableCard,
  CheckableCardBody,
  Checkbox,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  MultiLineText,
  Radio,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, MARKDOWN_FEATURES} from "/server/internal/skeleton";
import {useChangeDictionaryMarkdownFeatures} from "./change-dictionary-markdown-features-form-hook";


export const ChangeDictionaryMarkdownFeaturesForm = create(
  require("../common.scss"), "ChangeDictionaryMarkdownFeaturesForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("changeDictionaryMarkdownFeaturesForm");

    const {form, handleSubmit} = useChangeDictionaryMarkdownFeatures(dictionary);
    const {register, watch} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer label={false}>
          <ControlLabel>
            {trans("label.enable.label")}
          </ControlLabel>
          <div styleName="card-group">
            <CheckableCard styleName="card">
              <Radio value="true" {...register("enable")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">
                    {trans("label.enable.true")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enable.true")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="false" {...register("enable")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">
                    {trans("label.enable.false")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enable.false")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
          </div>
        </ControlContainer>
        {(watch("enable") === "true") && (
          <ControlContainer label={false}>
            <ControlLabel>
              {trans("label.features.label")}
            </ControlLabel>
            <div styleName="card-group">
              <CheckableCard styleName="card">
                <Checkbox checked={watch("enable") === "true"} disabled={true}/>
                <div styleName="label">
                  <div styleName="label-main">
                    {trans("label.features.basic")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">
                    {trans("labelHelper.features.basic")}
                  </MultiLineText>
                </div>
              </CheckableCard>
              {MARKDOWN_FEATURES.filter((feature) => feature !== "basic").map((feature) => (
                <CheckableCard styleName="card" key={feature}>
                  <Checkbox value={feature} {...register("features")}/>
                  <div styleName="label">
                    <div styleName="label-main">
                      {trans(`label.features.${feature}`)}
                    </div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">
                      {transNode(`labelHelper.features.${feature}`, {
                        pre: (parts) => <pre styleName="code">{parts}</pre>
                      })}
                    </MultiLineText>
                  </div>
                </CheckableCard>
              ))}
            </div>
          </ControlContainer>
        )}
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


