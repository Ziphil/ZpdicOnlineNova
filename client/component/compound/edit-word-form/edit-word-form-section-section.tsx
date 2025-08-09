//

import {faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditWordFormRelationSection} from "/client/component/compound/edit-word-form/edit-word-form-relation-section";
import {create} from "/client/component/create";
import {toLatinNumeral} from "/client/util/misc";
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
    sectionIndex
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue>,
    sectionOperations: Omit<UseFieldArrayReturn<any, "sections">, "fields">,
    sectionIndex: number
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    return (
      <div styleName="root">
        <div styleName="heading">
          <h3 styleName="heading-number">{toLatinNumeral(sectionIndex + 1)}</h3>
        </div>
        <div styleName="main">
          <EditWordFormEquivalentSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormInformationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormPhraseSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormVariationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormRelationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <div styleName="minus">
            <Button scheme="gray" variant="solid" onClick={() => sectionOperations.remove(sectionIndex)}>
              <ButtonIconbag><GeneralIcon icon={faMinus}/></ButtonIconbag>
              {trans("button.discard.section")}
            </Button>
          </div>
        </div>
      </div>
    );

  }
);