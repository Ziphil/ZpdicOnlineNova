/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus, faWandSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  IconButton,
  Input,
  SuggestionSpec,
  data,
  useTrans
} from "zographia";
import {useEditWordFormDndItem} from "/client/component/compound/edit-word-form/edit-word-form-dnd";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditWordFormValue} from "./edit-word-form-hook";


export const EditWordFormVariationItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditWordFormVariationItem",
  function ({
    dictionary,
    form,
    variationOperations,
    dndId,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    variationOperations: Omit<UseFieldArrayReturn<any, `sections.${number}.variations`>, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const generatePronunciation = useCallback(function (): void {
      if (dictionary.akrantiain !== null) {
        try {
          const value = form.getValues();
          form.setValue(`sections.0.variations.${index}.pronunciation`, dictionary.akrantiain.convert(value.sections[0].variations[index].name));
        } catch (error) {
          console.log(error);
        }
      };
    }, [dictionary, form, index]);

    const suggestVariationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "variation"}, {ignoreError: true});
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
      <div styleName="root" {...data({dragging})} {...rest} {...paneProps}>
        <div styleName="grip" {...gripProps}>
          <GeneralIcon icon={faGripVertical}/>
        </div>
        <fieldset styleName="field-list">
          <ControlContainer>
            <ControlLabel>{trans("label.variation.title")}</ControlLabel>
            <Input suggest={suggestVariationTitle} {...register(`sections.0.variations.${index}.title`)}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.variation.name")}</ControlLabel>
            <Input {...register(`sections.0.variations.${index}.name`)}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.variation.pronunciation")}</ControlLabel>
            <div styleName="row">
              <Input {...register(`sections.0.variations.${index}.pronunciation`)}/>
              {(dictionary.akrantiain !== null) && (
                <Button variant="light" onClick={generatePronunciation}>
                  <ButtonIconbag><GeneralIcon icon={faWandSparkles}/></ButtonIconbag>
                  {trans("button.generate")}
                </Button>
              )}
            </div>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <IconButton scheme="gray" variant="light" label={trans("discard.variation")} onClick={() => variationOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </IconButton>
        </div>
      </div>
    );

  }
);