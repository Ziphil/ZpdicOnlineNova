//

import {faArrowDown, faArrowUp, faCircleEllipsisVertical, faClone, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, Menu, MenuItem, MenuItemIconbag, MenuSeparator, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {toLatinNumeral} from "/client/util/misc";
import {useSwapAnimationItem} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditTemplateWordFormRelationSection} from "./edit-template-word-form-relation-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormPhraseSection} from "./edit-word-form-phrase-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditTemplateWordFormSectionSection = create(
  require("./edit-word-form-section-section.scss"), "EditTemplateWordFormSectionSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    dndId,
    sectionIndex,
    multiple,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditTemplateWordFormValue>,
    sectionOperations: Pick<UseFieldArrayReturn<any, "sections">, "append" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    multiple: boolean
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {getValues} = form;

    const {ref, props, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    const duplicate = useCallback(function (): void {
      sectionOperations.append(getValues(`sections.${sectionIndex}`));
    }, [sectionOperations, getValues, sectionIndex]);

    const remove = useCallback(function (): void {
      sectionOperations.remove(sectionIndex);
    }, [sectionOperations, sectionIndex]);

    return (
      <div styleName="root" ref={ref} {...props} {...rest}>
        {(multiple) && (
          <div styleName="heading">
            <div styleName="number-container">
              <h3 styleName="number">{toLatinNumeral(sectionIndex + 1)}</h3>
              <div styleName="button-container">
                <Menu
                  placement="bottom-start"
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
            </div>
          </div>
        )}
        <div styleName="main" {...data({multiple})}>
          <EditWordFormEquivalentSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormInformationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormPhraseSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormVariationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditTemplateWordFormRelationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          {(multiple) && (
            <div styleName="minus">
              <Button scheme="gray" variant="solid" onClick={() => sectionOperations.remove(sectionIndex)}>
                <ButtonIconbag><GeneralIcon icon={faTimes}/></ButtonIconbag>
                {trans("button.discard.section")}
              </Button>
            </div>
          )}
        </div>
      </div>
    );

  }
);