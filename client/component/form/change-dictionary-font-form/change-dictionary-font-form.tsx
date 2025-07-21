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
  ControlContainer,
  ControlLabel,
  FileInput,
  GeneralIcon,
  Input,
  MultiLineText,
  Radio,
  data,
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
    const {control, register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="card-group" {...data({vertical: "wide"})}>
            <CheckableCard styleName="card">
              <Radio value="none" {...register("type")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.type.none")}</div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.type.none")}</MultiLineText>
                </div>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="local" {...register("type")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.type.local")}</div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.type.local")}</MultiLineText>
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
              <Radio value="custom" {...register("type")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.type.custom")}</div>
                  <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.type.custom")}</MultiLineText>
                </div>
                <ControlContainer>
                  <ControlLabel>
                    {trans("label.input.file")}
                  </ControlLabel>
                  <Controller name="file" control={control} render={({field}) => (
                    <FileInput
                      value={field.value}
                      defaultValue={(dictionary.settings.font?.type === "custom") ? dictionary.settings.font?.name : undefined}
                      onSet={field.onChange}
                      error={getFieldState("file").error !== undefined}
                      multiple={false}
                    />
                  )}/>
                  <ControlErrorMessage name="file" form={form} trans={trans}/>
                </ControlContainer>
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