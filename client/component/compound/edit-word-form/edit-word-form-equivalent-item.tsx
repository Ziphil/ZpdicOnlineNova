/* eslint-disable react/jsx-closing-bracket-location */

import {faMinus} from "@fortawesome/sharp-regular-svg-icons";
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
  GrabbablePane,
  GrabbablePaneBody,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
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
    sectionIndex,
    equivalentIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    equivalentOperations: Omit<UseFieldArrayReturn<any, `sections.${number}.equivalents`>, "fields">,
    dndId: string,
    sectionIndex: number,
    equivalentIndex: number,
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
      <GrabbablePane styleName="root" dragging={dragging} {...rest} {...paneProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneGrip {...gripProps}/>
        </GrabbablePaneGripContainer>
        <GrabbablePaneBody styleName="body">
          <fieldset styleName="field-list">
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.equivalent.titles")}</ControlLabel>
              <Controller name={`sections.${sectionIndex}.equivalents.${equivalentIndex}.titles`} control={form.control} render={({field}) => (
                <TagInput values={field.value} suggest={suggestEquivalentTitle} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>
                {transNode("label.equivalent.terms", {
                  note: (parts) => <span styleName="note">{parts}</span>
                })}
              </ControlLabel>
              <Input {...register(`sections.${sectionIndex}.equivalents.${equivalentIndex}.termString`)}/>
            </ControlContainer>
            <ControlContainer styleName="field-item" {...data({checkable: true})}>
              <CheckableContainer>
                <Checkbox {...register(`sections.${sectionIndex}.equivalents.${equivalentIndex}.hidden`)}/>
                <CheckableLabel><MultiLineText>{trans("label.equivalent.hidden")}</MultiLineText></CheckableLabel>
              </CheckableContainer>
            </ControlContainer>
          </fieldset>
          <div styleName="minus">
            <IconButton scheme="gray" variant="light" label={trans("discard.equivalent")} onClick={() => equivalentOperations.remove(equivalentIndex)}>
              <GeneralIcon icon={faMinus}/>
            </IconButton>
          </div>
        </GrabbablePaneBody>
      </GrabbablePane>
    );

  }
);