/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  SuggestionSpec,
  TagInput,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {switchResponse} from "/client-new/util/response";
import {useEditWordFormDndItem} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";


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
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    equivalentOperations: Omit<UseFieldArrayReturn<any, "equivalents">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps} = useEditWordFormDndItem(dndId);

    const suggestEquivalentTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "equivalent"}, {ignoreError: true});
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
        </fieldset>
        <div styleName="minus">
          <Button scheme="gray" variant="light" onClick={() => equivalentOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </Button>
        </div>
      </div>
    );

  }
);