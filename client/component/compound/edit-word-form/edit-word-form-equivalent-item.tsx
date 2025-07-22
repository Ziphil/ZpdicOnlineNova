/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {
  AdditionalProps,
  CheckableContainer,
  CheckableLabel,
  Checkbox,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  IconButton,
  Input,
  MultiLineText,
  SuggestionSpec,
  TagInput,
  data,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {useEditWordFormDndItem} from "./edit-word-form-dnd";
import {EditWordFormValue} from "./edit-word-form-hook";


export const EditWordFormEquivalentItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditWordFormEquivalentItem",
  function ({
    dictionary,
    form,
    equivalentOperations,
    dndId,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    equivalentOperations: Omit<UseFieldArrayReturn<any, "equivalents">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const suggestEquivalentTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "equivalent"}, {ignoreError: true});
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
            <ControlLabel>{trans("label.equivalent.titles")}</ControlLabel>
            <Controller name={`equivalents.${index}.titles`} control={form.control} render={({field}) => (
              <TagInput values={field.value} suggest={suggestEquivalentTitle} onSet={field.onChange}/>
            )}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>
              {transNode("label.equivalent.names", {
                note: (parts) => <span styleName="note">{parts}</span>
              })}
            </ControlLabel>
            <Input {...register(`equivalents.${index}.nameString`)}/>
          </ControlContainer>
          <ControlContainer>
            <CheckableContainer>
              <Checkbox {...register(`equivalents.${index}.hidden`)}/>
              <CheckableLabel><MultiLineText>{trans("label.equivalent.hidden")}</MultiLineText></CheckableLabel>
            </CheckableContainer>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <IconButton scheme="gray" variant="light" label={trans("discard.equivalent")} onClick={() => equivalentOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </IconButton>
        </div>
      </div>
    );

  }
);