/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  SuggestionSpec,
  useTrans
} from "zographia";
import {useEditWordFormDndItem} from "/client-new/component/compound/edit-word-form/edit-word-form-dnd";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {switchResponse} from "/client-new/util/response";
import {EditWordSpec} from "./edit-word-form-hook";


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
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    variationOperations: Omit<UseFieldArrayReturn<any, "variations">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps} = useEditWordFormDndItem(dndId);

    const suggestVariationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "variation"}, {ignoreError: true});
        return switchResponse(response, (data) => {
          const titles = data;
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
      <div styleName="root" {...rest} {...paneProps}>
        <div styleName="grip" {...gripProps}>
          <GeneralIcon icon={faGripVertical}/>
        </div>
        <fieldset styleName="field-list">
          <ControlContainer>
            <ControlLabel>{trans("label.variation.title")}</ControlLabel>
            <Input suggest={suggestVariationTitle} {...register(`variations.${index}.title`)}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.variation.name")}</ControlLabel>
            <Input {...register(`variations.${index}.name`)}/>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <Button scheme="gray" variant="light" onClick={() => variationOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </Button>
        </div>
      </div>
    );

  }
);