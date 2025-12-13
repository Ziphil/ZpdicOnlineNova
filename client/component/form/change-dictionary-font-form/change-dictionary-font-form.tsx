/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableCard,
  CheckableCardBody,
  Checkbox,
  ControlContainer,
  ControlLabel,
  FileInput,
  GeneralIcon,
  Input,
  MultiLineText,
  Radio,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
import {useChangeDictionaryFont} from "./change-dictionary-font-form-hook";


export const ChangeDictionaryFontForm = create(
  require("../common.scss"), "ChangeDictionaryFontForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryFontForm");

    const {form, handleSubmit} = useChangeDictionaryFont(dictionary);
    const {control, register, watch, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer label={false}>
          <ControlLabel>
            {trans("label.kind.label")}
          </ControlLabel>
          <div styleName="card-group">
            <CheckableCard styleName="card">
              <Radio value="custom" {...register("kind")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.kind.custom")}</div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.kind.custom")}</MultiLineText>
                </div>
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.input.file")}
                  </ControlLabel>
                  <Controller name="file" control={control} render={({field}) => (
                    <FileInput
                      value={field.value}
                      defaultValue={(dictionary.settings.font?.kind === "custom") ? dictionary.settings.font?.name : undefined}
                      onSet={field.onChange}
                      error={getFieldState("file").error !== undefined}
                      multiple={false}
                    />
                  )}/>
                  <ControlErrorMessage name="file" form={form} trans={trans}/>
                </ControlContainer>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="local" {...register("kind")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.kind.local")}</div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.kind.local")}</MultiLineText>
                </div>
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.input.name")}
                  </ControlLabel>
                  <Input error={!!getFieldState("name").error} {...register("name")}/>
                  <ControlErrorMessage name="name" form={form} trans={trans}/>
                </ControlContainer>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="none" {...register("kind")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.kind.none")}</div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.kind.none")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
          </div>
        </ControlContainer>
        {(watch("kind") !== "none") && (
          <ControlContainer label={false}>
            <ControlLabel>
              {trans("label.targets.label")}
            </ControlLabel>
            <div styleName="card-group">
              <CheckableCard styleName="card">
                <Checkbox value="heading" {...register("targets")}/>
                <div styleName="label">
                  <div styleName="label-main">
                    {trans("label.targets.heading")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.targets.heading")}</MultiLineText>
                </div>
              </CheckableCard>
              <CheckableCard styleName="card">
                <Checkbox value="phrase" {...register("targets")}/>
                <div styleName="label">
                  <div styleName="label-main">
                    {trans("label.targets.phrase")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.targets.phrase")}</MultiLineText>
                </div>
              </CheckableCard>
              <CheckableCard styleName="card">
                <Checkbox value="text" {...register("targets")}/>
                <div styleName="label">
                  <div styleName="label-main">
                    {trans("label.targets.text")}
                  </div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.targets.text")}</MultiLineText>
                </div>
              </CheckableCard>
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