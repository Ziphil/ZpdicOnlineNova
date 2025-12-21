/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faClone, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
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
  Menu,
  MenuItem,
  MenuItemIconbag,
  MenuSeparator,
  SuggestionSpec,
  TagInput,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {useSwapAnimationItem} from "/client/util/swap-animation";
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
    relationIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditTemplateWordSpec["form"],
    relationOperations: Omit<UseFieldArrayReturn<any, `sections.${number}.relations`>, "fields">,
    dndId: string,
    sectionIndex: number,
    relationIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register, getValues} = form;
    const {paneProps, paneRef, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const {ref: swapRef, props: swapProps, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    const mergedRef = useMergeRefs([paneRef, swapRef]);

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

    const duplicate = useCallback(function (): void {
      relationOperations.insert(relationIndex, getValues(`sections.${sectionIndex}.relations.${relationIndex}`), {focusIndex: relationIndex + 1});
    }, [relationOperations, getValues, sectionIndex, relationIndex]);

    const remove = useCallback(function (): void {
      relationOperations.remove(relationIndex);
    }, [relationOperations, relationIndex]);

    return (
      <GrabbablePane styleName="root" dragging={dragging} ref={mergedRef} {...rest} {...paneProps} {...swapProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneGrip {...gripProps}/>
        </GrabbablePaneGripContainer>
        <GrabbablePaneBody styleName="body">
          <fieldset styleName="field-list">
            <ControlContainer styleName="field-item">
              <ControlLabel>{trans("label.relation.titles")}</ControlLabel>
              <Controller name={`sections.${sectionIndex}.relations.${relationIndex}.titles`} control={form.control} render={({field}) => (
                <TagInput values={field.value} suggest={suggestRelationTitle} onSet={field.onChange}/>
              )}/>
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