/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, useCallback} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  Input,
  SuggestionSpec,
  TagInput,
  data,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordSpec} from "./edit-template-word-form-hook";


export const EditTemplateWordFormBasicSection = create(
  require("./edit-word-form-basic-section.scss"), "EditTemplateWordFormBasicSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditTemplateWordSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register, control, getFieldState, formState: {errors}} = form;

    const suggestTag = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "tag"}, {ignoreError: true});
        return switchResponse(response, (titles) => {
          const suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        }, () => {
          return [];
        });
      } catch {
        return [];
      }
    }, [dictionary.number]);

    return (
      <>
        <section styleName="root" {...rest}>
          <h3 styleName="heading">{trans("heading.template")}</h3>
          <div styleName="field-list" {...data({vertical: true})}>
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.title")}</ControlLabel>
              <div styleName="control-container">
                <Input error={!!getFieldState("title").error} {...register("title")}/>
                <ControlErrorMessage name="title" form={form} trans={trans}/>
              </div>
            </ControlContainer>
          </div>
        </section>
        <section styleName="root" {...rest}>
          <h3 styleName="heading">{trans("heading.basic")}</h3>
          <div styleName="field-list">
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.spelling")}</ControlLabel>
              <div styleName="control-container">
                <Input error={!!getFieldState("spelling").error} {...register("spelling")}/>
                <ControlErrorMessage name="spelling" form={form} trans={trans}/>
              </div>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.pronunciation")}</ControlLabel>
              <div styleName="control-container">
                <Input error={!!getFieldState("pronunciation").error} {...register("pronunciation")}/>
                <ControlErrorMessage name="pronunciation" form={form} trans={trans}/>
              </div>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.tags")}</ControlLabel>
              <div styleName="control-container">
                <Controller name="tags" control={control} render={({field}) => (
                  <TagInput tagVariant="solid" error={!!getFieldState("tags").error} values={field.value ?? []} suggest={suggestTag} onSet={field.onChange}/>
                )}/>
                <ControlErrorMessage name="tags" form={form} trans={trans}/>
              </div>
            </ControlContainer>
          </div>
        </section>
      </>
    );

  }
);