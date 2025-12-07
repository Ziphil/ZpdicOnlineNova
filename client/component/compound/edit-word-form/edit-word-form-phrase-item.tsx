/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faClone, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  GrabbablePane,
  GrabbablePaneBody,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
  Input,
  Menu,
  MenuItem,
  MenuItemIconbag,
  MenuSeparator,
  SuggestionSpec,
  TagInput,
  Textarea,
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

    const {register, getValues} = form;
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

    const duplicate = useCallback(function (): void {
      phraseOperations.append(getValues(`sections.${sectionIndex}.phrases.${phraseIndex}`));
    }, [phraseOperations, getValues, sectionIndex, phraseIndex]);

    const remove = useCallback(function (): void {
      phraseOperations.remove(phraseIndex);
    }, [phraseOperations, phraseIndex]);

    return (
      <GrabbablePane styleName="root" dragging={dragging} ref={mergedRef} {...rest} {...paneProps} {...swapProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneGrip {...gripProps}/>
        </GrabbablePaneGripContainer>
        <GrabbablePaneBody styleName="body">
          <fieldset styleName="field-list">
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.phrase.titles")}</ControlLabel>
              <Controller name={`sections.${sectionIndex}.phrases.${phraseIndex}.titles`} control={form.control} render={({field}) => (
                <TagInput tagScheme="gray" values={field.value} suggest={suggestPhraseTitle} onSet={field.onChange}/>
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
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.phrase.text")}</ControlLabel>
              <Textarea styleName="small-textarea" {...register(`sections.${sectionIndex}.phrases.${phraseIndex}.text`)}/>
            </ControlContainer>
          </fieldset>
          <div styleName="minus">
            <Menu
              placement="bottom-end"
              trigger={(
                <Button scheme="gray" variant="simple">
                  <GeneralIcon icon={faCircleEllipsisVertical}/>
                </Button>
              )}
            >
              <MenuItem disabled={!canMoveUp} onClick={moveUp}>
                <MenuItemIconbag><GeneralIcon icon={faArrowUp}/></MenuItemIconbag>
                {trans("menu.moveUp")}
              </MenuItem>
              <MenuItem disabled={!canMoveDown} onClick={moveDown}>
                <MenuItemIconbag><GeneralIcon icon={faArrowDown}/></MenuItemIconbag>
                {trans("menu.moveDown")}
              </MenuItem>
              <MenuSeparator/>
              <MenuItem onClick={duplicate}>
                <MenuItemIconbag><GeneralIcon icon={faClone}/></MenuItemIconbag>
                {trans("menu.duplicate")}
              </MenuItem>
              <MenuItem onClick={remove}>
                <MenuItemIconbag><GeneralIcon icon={faTimes}/></MenuItemIconbag>
                {trans("menu.discard")}
              </MenuItem>
            </Menu>
          </div>
        </GrabbablePaneBody>
      </GrabbablePane>
    );

  }
);