/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, CheckableContainer, CheckableLabel, ControlContainer, ControlLabel, FileInput, GeneralIcon, Input, Radio, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {useChangeDictionaryFontSpec} from "./change-dictionary-font-spec-form-hook";


export const ChangeDictionaryFontSpecForm = create(
  require("../common.scss"), "ChangeDictionaryFontSpecForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionarySecretForm");

    const {form, handleSubmit} = useChangeDictionaryFontSpec(dictionary);
    const {control, register, watch, getFieldState, formState: {errors}} = form;

    const type = watch("type");

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="radio-group">
            <CheckableContainer>
              <Radio value="none" {...register("type")}/>
              <CheckableLabel>{trans("label.none")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="local" {...register("type")}/>
              <CheckableLabel>{trans("label.local")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="custom" {...register("type")}/>
              <CheckableLabel>{trans("label.custom")}</CheckableLabel>
            </CheckableContainer>
          </div>
        </ControlContainer>
        {(type === "local") && (
          <ControlContainer>
            <ControlLabel>
              {trans("label.name")}
            </ControlLabel>
            <Input error={!!getFieldState("name").error} {...register("name")}/>
            <ControlErrorMessage name="name" form={form} trans={trans}/>
          </ControlContainer>
        )}
        {(type === "custom") && (
          <ControlContainer>
            <ControlLabel>
              {trans("label.file")}
            </ControlLabel>
            <Controller name="file" control={control} render={({field}) => (
              <FileInput
                value={field.value}
                onSet={field.onChange}
                error={getFieldState("file").error !== undefined}
                accepts={["font/*"]}
                multiple={false}
              />
            )}/>
            <ControlErrorMessage name="file" form={form} trans={trans}/>
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