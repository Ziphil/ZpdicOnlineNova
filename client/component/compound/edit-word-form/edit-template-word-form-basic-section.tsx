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
  useTrans
} from "zographia";
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

    const {register, control} = form;

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
          <div styleName="control">
            <ControlContainer>
              <ControlLabel>{trans("label.title")}</ControlLabel>
              <Input {...register("title")}/>
            </ControlContainer>
          </div>
        </section>
        <section styleName="root" {...rest}>
          <h3 styleName="heading">{trans("heading.basic")}</h3>
          <div styleName="control">
            <ControlContainer>
              <ControlLabel>{trans("label.name")}</ControlLabel>
              <Input {...register("name")}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.pronunciation")}</ControlLabel>
              <Input {...register("pronunciation")}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.tags")}</ControlLabel>
              <Controller name="tags" control={control} render={({field}) => (
                <TagInput tagVariant="solid" values={field.value ?? []} suggest={suggestTag} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
          </div>
        </section>
      </>
    );

  }
);