/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  CheckableContainer,
  CheckableLabel,
  Checkbox,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  IconButton,
  SuggestionSpec,
  TagInput,
  data,
  useTrans
} from "zographia";
import {RelationWordSelect} from "/client/component/atom/relation-word-select";
import {create} from "/client/component/create";
import {EnhancedDictionary} from "/client/skeleton";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {useEditWordFormDndItem} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";


export const EditWordFormRelationItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditWordFormRelationItem",
  function ({
    dictionary,
    form,
    relationOperations,
    dndId,
    index,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    relationOperations: Omit<UseFieldArrayReturn<any, "relations">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const suggestRelationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "relation"}, {ignoreError: true});
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
      <div styleName="root" {...data({dragging})} {...rest} {...paneProps}>
        <div styleName="grip" {...gripProps}>
          <GeneralIcon icon={faGripVertical}/>
        </div>
        <fieldset styleName="field-list">
          <ControlContainer>
            <ControlLabel>{trans("label.relation.titles")}</ControlLabel>
            <Controller name={`relations.${index}.titles`} control={form.control} render={({field}) => (
              <TagInput values={field.value} suggest={suggestRelationTitle} onSet={field.onChange}/>
            )}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.relation.name")}</ControlLabel>
            <Controller name={`relations.${index}.word`} control={form.control} render={({field}) => (
              <RelationWordSelect dictionary={dictionary} word={field.value} onSet={field.onChange}/>
            )}/>
          </ControlContainer>
          <ControlContainer>
            <CheckableContainer>
              <Checkbox {...register(`relations.${index}.mutual`)}/>
              <CheckableLabel>{trans("label.relation.mutual")}</CheckableLabel>
            </CheckableContainer>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <IconButton scheme="gray" variant="light" label={trans("discard.relation")} onClick={() => relationOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </IconButton>
        </div>
      </div>
    );

  }
);