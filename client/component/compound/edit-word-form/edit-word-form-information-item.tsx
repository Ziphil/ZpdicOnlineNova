/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
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
  GrabbablePaneButton,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
  IconButton,
  Input,
  MultiLineText,
  SuggestionSpec,
  Textarea,
  data,
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


export const EditWordFormInformationItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditWordFormInformationItem",
  function ({
    dictionary,
    form,
    informationOperations,
    dndId,
    sectionIndex,
    informationIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    informationOperations: Pick<UseFieldArrayReturn<any, `sections.${number}.informations`>, "append" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    informationIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, paneRef, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const {ref: swapRef, props: swapProps, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    const mergedRef = useMergeRefs([paneRef, swapRef]);

    const suggestInformationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "information"}, {ignoreError: true});
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
              <ControlLabel>{trans("label.information.title")}</ControlLabel>
              <Input suggest={suggestInformationTitle} {...register(`sections.${sectionIndex}.informations.${informationIndex}.title`)}/>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.information.text")}</ControlLabel>
              <Textarea styleName="textarea" {...register(`sections.${sectionIndex}.informations.${informationIndex}.text`)}/>
            </ControlContainer>
            <ControlContainer styleName="field-item" {...data({checkable: true})}>
              <CheckableContainer>
                <Checkbox {...register(`sections.${sectionIndex}.informations.${informationIndex}.hidden`)}/>
                <CheckableLabel><MultiLineText>{trans("label.information.hidden")}</MultiLineText></CheckableLabel>
              </CheckableContainer>
            </ControlContainer>
          </fieldset>
          <div styleName="minus">
            <IconButton scheme="gray" variant="light" label={trans("discard.information")} onClick={() => informationOperations.remove(informationIndex)}>
              <GeneralIcon icon={faTimes}/>
            </IconButton>
          </div>
        </GrabbablePaneBody>
      </GrabbablePane>
    );

  }
);