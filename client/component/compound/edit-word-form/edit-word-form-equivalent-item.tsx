/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faClone, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
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
  GrabbablePaneButton,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
  Input,
  Menu,
  MenuItem,
  MenuItemIconbag,
  MenuSeparator,
  MultiLineText,
  SuggestionSpec,
  TagInput,
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
    equivalentOperations: Pick<UseFieldArrayReturn<any, `sections.${number}.equivalents`>, "append" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    equivalentIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {register, getValues} = form;
    const {paneProps, paneRef, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const {ref: swapRef, props: swapProps, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    const mergedRef = useMergeRefs([paneRef, swapRef]);

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

    const duplicate = useCallback(function (): void {
      equivalentOperations.append(getValues(`sections.${sectionIndex}.equivalents.${equivalentIndex}`));
    }, [equivalentOperations, getValues, sectionIndex, equivalentIndex]);

    const remove = useCallback(function (): void {
      equivalentOperations.remove(equivalentIndex);
    }, [equivalentOperations, equivalentIndex]);

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