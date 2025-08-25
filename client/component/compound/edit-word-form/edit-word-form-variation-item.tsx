/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faClone, faTimes, faWandSparkles} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  GrabbablePane,
  GrabbablePaneBody,
  GrabbablePaneButton,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
  Input,
  Menu,
  MenuItem,
  MenuItemIconbag,
  MenuSeparator,
  SuggestionSpec,
  useTrans
} from "zographia";
import {useEditWordFormDndItem} from "/client/component/compound/edit-word-form/edit-word-form-dnd";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {useSwapAnimationItem} from "/client/util/swap-animation";
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
    sectionIndex,
    variationIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    variationOperations: Pick<UseFieldArrayReturn<any, `sections.${number}.variations`>, "append" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    variationIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register, getValues} = form;
    const {paneProps, paneRef, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const {ref: swapRef, props: swapProps, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    const mergedRef = useMergeRefs([paneRef, swapRef]);

    const generatePronunciation = useCallback(function (): void {
      if (dictionary.akrantiain !== null) {
        try {
          const value = form.getValues();
          form.setValue(`sections.${sectionIndex}.variations.${variationIndex}.pronunciation`, dictionary.akrantiain.convert(value.sections[sectionIndex].variations[variationIndex].spelling));
        } catch (error) {
          console.log(error);
        }
      };
    }, [dictionary, form, sectionIndex, variationIndex]);

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

    const duplicate = useCallback(function (): void {
      variationOperations.append(getValues(`sections.${sectionIndex}.variations.${variationIndex}`));
    }, [variationOperations, getValues, sectionIndex, variationIndex]);

    const remove = useCallback(function (): void {
      variationOperations.remove(variationIndex);
    }, [variationOperations, variationIndex]);

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
              <ControlLabel>{trans("label.variation.title")}</ControlLabel>
              <Input suggest={suggestVariationTitle} {...register(`sections.${sectionIndex}.variations.${variationIndex}.title`)}/>
            </ControlContainer>
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.variation.spelling")}</ControlLabel>
              <Input {...register(`sections.${sectionIndex}.variations.${variationIndex}.spelling`)}/>
            </ControlContainer>
            {(dictionary.settings.showVariationPronunciation) && (
              <ControlContainer styleName="field-item">
                <ControlLabel>{trans("label.variation.pronunciation")}</ControlLabel>
                <div styleName="row">
                  <Input {...register(`sections.${sectionIndex}.variations.${variationIndex}.pronunciation`)}/>
                  {(dictionary.akrantiain !== null) && (
                    <Button scheme="primary" variant="light" onClick={generatePronunciation}>
                      <ButtonIconbag><GeneralIcon icon={faWandSparkles}/></ButtonIconbag>
                      {trans("button.generate")}
                    </Button>
                  )}
                </div>
              </ControlContainer>
            )}
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