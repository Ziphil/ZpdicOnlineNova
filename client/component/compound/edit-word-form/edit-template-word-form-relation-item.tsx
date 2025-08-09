/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  IconButton,
  SuggestionSpec,
  TagInput,
  data,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordSpec} from "./edit-template-word-form-hook";
import {useEditWordFormDndItem} from "./edit-word-form-dnd";


export const EditTemplateWordFormRelationItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditTemplateWordFormRelationItem",
  function ({
    dictionary,
    form,
    relationOperations,
    dndId,
    sectionIndex,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditTemplateWordSpec["form"],
    relationOperations: Omit<UseFieldArrayReturn<any, `sections.${number}.relations`>, "fields">,
    dndId: string,
    sectionIndex: number,
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
          <ControlContainer styleName="field-item">
            <ControlLabel>{trans("label.relation.titles")}</ControlLabel>
            <Controller name={`sections.${sectionIndex}.relations.${index}.titles`} control={form.control} render={({field}) => (
              <TagInput values={field.value} suggest={suggestRelationTitle} onSet={field.onChange}/>
            )}/>
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