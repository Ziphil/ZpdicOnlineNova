//

import {faArrowDown, faArrowUp, faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, data, useTrans} from "zographia";
import {EditWordFormRelationSection} from "/client/component/compound/edit-word-form/edit-word-form-relation-section";
import {create} from "/client/component/create";
import {toLatinNumeral} from "/client/util/misc";
import {useSwapAnimationItem} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordFormValue} from "./edit-word-form-hook";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormPhraseSection} from "./edit-word-form-phrase-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditWordFormSectionSection = create(
  require("./edit-word-form-section-section.scss"), "EditWordFormSectionSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    dndId,
    sectionIndex,
    multiple
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue>,
    sectionOperations: Pick<UseFieldArrayReturn<any, "sections">, "append" | "update" | "remove">,
    dndId: string,
    sectionIndex: number,
    multiple: boolean
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {ref, props, canMoveUp, canMoveDown, moveUp, moveDown} = useSwapAnimationItem(dndId);

    return (
      <div styleName="root" ref={ref} {...props}>
        {(multiple) && (
          <div styleName="heading">
            <div styleName="number-container">
              <h3 styleName="number">{toLatinNumeral(sectionIndex + 1)}</h3>
              <div styleName="button-container">
                <button styleName="button" type="button" disabled={!canMoveUp} onClick={moveUp}>
                  <GeneralIcon icon={faArrowUp}/>
                </button>
                <button styleName="button" type="button" disabled={!canMoveDown} onClick={moveDown}>
                  <GeneralIcon icon={faArrowDown}/>
                </button>
              </div>
            </div>
          </div>
        )}
        <div styleName="main" {...data({multiple})}>
          <EditWordFormEquivalentSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormInformationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormPhraseSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormVariationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormRelationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
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