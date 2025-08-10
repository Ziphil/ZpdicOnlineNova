/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  GrabbablePane,
  GrabbablePaneBody,
  GrabbablePaneButton,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
  IconButton,
  Input,
  SuggestionSpec,
  TagInput,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {useSwapAnimationItem} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {useEditWordFormDndItem} from "./edit-word-form-dnd";
import {EditWordFormValue} from "./edit-word-form-hook";


export const EditWordFormPhraseItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditWordFormPhraseItem",
  function ({
    dictionary,
    form,
    phraseOperations,
    dndId,
    sectionIndex,
    phraseIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    phraseOperations: Pick<UseFieldArrayReturn<any, `sections.${number}.phrases`>, "append" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    phraseIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, paneRef, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const {ref: swapRef, props: swapProps, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    const mergedRef = useMergeRefs([paneRef, swapRef]);

    const suggestPhraseTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "phrase"}, {ignoreError: true});
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
      <GrabbablePane styleName="root" dragging={dragging} ref={mergedRef} {...rest} {...paneProps} {...swapProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneButton position="top" disabled={!canMoveUp} onClick={moveUp}/>
          <GrabbablePaneGrip {...gripProps}/>
          <GrabbablePaneButton position="bottom" disabled={!canMoveDown} onClick={moveDown}/>
        </GrabbablePaneGripContainer>
        <GrabbablePaneBody styleName="body">
          <fieldset styleName="field-list">
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.phrase.titles")}</ControlLabel>
              <Controller name={`sections.${sectionIndex}.phrases.${phraseIndex}.titles`} control={form.control} render={({field}) => (
                <TagInput values={field.value} suggest={suggestPhraseTitle} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.phrase.expression")}</ControlLabel>
              <Input {...register(`sections.${sectionIndex}.phrases.${phraseIndex}.expression`)}/>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>{transNode("label.phrase.terms")}</ControlLabel>
              <Input {...register(`sections.${sectionIndex}.phrases.${phraseIndex}.termString`)}/>
            </ControlContainer>
          </fieldset>
          <div styleName="minus">
            <IconButton scheme="gray" variant="light" label={trans("discard.phrase")} onClick={() => phraseOperations.remove(phraseIndex)}>
              <GeneralIcon icon={faMinus}/>
            </IconButton>
          </div>
        </GrabbablePaneBody>
      </GrabbablePane>
    );

  }
);