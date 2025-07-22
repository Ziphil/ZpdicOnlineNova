/* eslint-disable react/jsx-closing-bracket-location */

import {faWandSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ChangeEvent, ReactElement, useCallback, useState} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlHelper,
  ControlLabel,
  GeneralIcon,
  Input,
  SuggestionSpec,
  TagInput,
  useDebouncedCallback,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditWordSpec} from "./edit-word-form-hook";


export const EditWordFormBasicSection = create(
  require("./edit-word-form-basic-section.scss"), "EditWordFormBasicSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditWordSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const [duplicateName, setDuplicateName] = useState(false);
    const {register, control} = form;

    const generateName = useCallback(function (): void {
      if (dictionary.zatlin !== null) {
        try {
          form.setValue("name", dictionary.zatlin.generate());
        } catch (error) {
          console.log(error);
        }
      };
    }, [dictionary, form]);

    const generatePronunciation = useCallback(function (): void {
      if (dictionary.akrantiain !== null) {
        try {
          const value = form.getValues();
          form.setValue("pronunciation", dictionary.akrantiain.convert(value.name));
        } catch (error) {
          console.log(error);
        }
      };
    }, [dictionary, form]);

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

    const handleNameChange = useDebouncedCallback(async function (event: ChangeEvent<HTMLInputElement>): Promise<void> {
      if (dictionary.settings.enableDuplicateName) {
        const name = event.target.value;
        const number = dictionary.number;
        const excludedWordNumber = form.getValues("number") ?? undefined;
        if (name !== "") {
          const response = await request("checkDuplicateWordName", {number, name, excludedWordNumber}, {ignoreError: true});
          switchResponse(response, ({duplicate}) => {
            setDuplicateName(duplicate);
          });
        }
      }
    }, 300, [dictionary.number, form.getValues]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.basic")}</h3>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.name")}</ControlLabel>
            <div styleName="row">
              <Input {...register("name", {onChange: handleNameChange})}/>
              {(dictionary.zatlin !== null) && (
                <Button variant="light" onClick={generateName}>
                  <ButtonIconbag><GeneralIcon icon={faWandSparkles}/></ButtonIconbag>
                  {trans("button.generate")}
                </Button>
              )}
            </div>
            {(duplicateName) && (
              <ControlHelper>
                {trans("duplicateName")}
              </ControlHelper>
            )}
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.pronunciation")}</ControlLabel>
            <div styleName="row">
              <Input {...register("pronunciation")}/>
              {(dictionary.akrantiain !== null) && (
                <Button variant="light" onClick={generatePronunciation}>
                  <ButtonIconbag><GeneralIcon icon={faWandSparkles}/></ButtonIconbag>
                  {trans("button.generate")}
                </Button>
              )}
            </div>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.tags")}</ControlLabel>
            <Controller name="tags" control={control} render={({field}) => (
              <TagInput tagVariant="solid" values={field.value ?? []} suggest={suggestTag} onSet={field.onChange}/>
            )}/>
          </ControlContainer>
        </div>
      </section>
    );

  }
);