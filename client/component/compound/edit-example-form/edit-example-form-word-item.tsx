/* eslint-disable react/jsx-closing-bracket-location */

import {useMergeRefs} from "@floating-ui/react";
import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  GeneralIcon,
  GrabbablePane,
  GrabbablePaneBody,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
  Menu,
  MenuItem,
  MenuItemIconbag,
  MenuSeparator,
  data,
  useTrans
} from "zographia";
import {RelationWordSelect} from "/client/component/atom/relation-word-select";
import {create} from "/client/component/create";
import {useSwapAnimationItem} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {useEditExampleFormDndItem} from "./edit-example-form-dnd";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormWordItem = create(
  require("./edit-example-form-word-item.scss"), "EditExampleFormWordItem",
  function ({
    dictionary,
    form,
    wordOperations,
    dndId,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditExampleSpec["form"],
    wordOperations: Omit<UseFieldArrayReturn<any, "words">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {paneProps, paneRef, gripProps, dragging} = useEditExampleFormDndItem(dndId);
    const {ref: swapRef, props: swapProps, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);
    const mergedRef = useMergeRefs([paneRef, swapRef]);

    return (
      <GrabbablePane styleName="root" dragging={dragging} ref={mergedRef} {...rest} {...paneProps} {...swapProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneGrip {...gripProps}/>
        </GrabbablePaneGripContainer>
        <GrabbablePaneBody styleName="body">
          <fieldset styleName="field-list">
            <ControlContainer styleName="field-item" {...data({checkable: true})}>
              <Controller name={`words.${index}`} control={form.control} render={({field}) => (
                <RelationWordSelect dictionary={dictionary} word={field.value} onSet={field.onChange}/>
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
              <MenuItem onClick={() => wordOperations.remove(index)}>
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