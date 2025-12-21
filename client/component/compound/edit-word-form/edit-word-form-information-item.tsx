/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faClone, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
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
  Input,
  Menu,
  MenuItem,
  MenuItemIconbag,
  MenuSeparator,
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
    informationOperations: Pick<UseFieldArrayReturn<any, `sections.${number}.informations`>, "append" | "insert" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    informationIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register, getValues} = form;
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

    const duplicate = useCallback(function (): void {
      informationOperations.insert(informationIndex, getValues(`sections.${sectionIndex}.informations.${informationIndex}`), {focusIndex: informationIndex + 1});
    }, [informationOperations, getValues, sectionIndex, informationIndex]);

    const remove = useCallback(function (): void {
      informationOperations.remove(informationIndex);
    }, [informationOperations, informationIndex]);

    return (
      <GrabbablePane styleName="root" dragging={dragging} ref={mergedRef} {...rest} {...paneProps} {...swapProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneGrip {...gripProps}/>
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