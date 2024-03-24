/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableContainer,
  CheckableLabel,
  ControlContainer,
  ControlLabel,
  FileInput,
  GeneralIcon,
  Input,
  Radio,
  data,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
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

    const type = watch("type");

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="radio-group" {...data({mobileVertical: true})}>
            <CheckableContainer>
              <Radio value="none" {...register("type")}/>
              <CheckableLabel>{trans("label.type.none")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="local" {...register("type")}/>
              <CheckableLabel>{trans("label.type.local")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="custom" {...register("type")}/>
              <CheckableLabel>{trans("label.type.custom")}</CheckableLabel>
            </CheckableContainer>
          </div>
        </ControlContainer>
        {(type === "local") && (
          <ControlContainer>
            <ControlLabel>
              {trans("label.input.name")}
            </ControlLabel>
            <Input error={!!getFieldState("name").error} {...register("name")}/>
            <ControlErrorMessage name="name" form={form} trans={trans}/>
          </ControlContainer>
        )}
        {(type === "custom") && (
          <ControlContainer>
            <ControlLabel>
              {trans("label.input.file")}
            </ControlLabel>
            <Controller name="file" control={control} render={({field}) => (
              <FileInput
                value={field.value}
                onSet={field.onChange}
                error={getFieldState("file").error !== undefined}
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