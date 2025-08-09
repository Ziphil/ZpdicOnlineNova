//

import {ReactElement} from "react";
import {UseFieldArrayReturn, UseFormReturn} from "react-hook-form";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {toLatinNumeral} from "/client/util/misc";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditTemplateWordFormRelationSection} from "./edit-template-word-form-relation-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditTemplateWordFormSectionSection = create(
  require("./edit-word-form-section-section.scss"), "EditTemplateWordFormSectionSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    sectionIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditTemplateWordFormValue>,
    sectionOperations: Omit<UseFieldArrayReturn<any, "sections">, "fields">,
    sectionIndex: number
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    return (
      <section styleName="section">
        <h3 styleName="heading">{trans("heading.section", {numberString: toLatinNumeral(sectionIndex + 1)})}</h3>
        <div styleName="main">
          <EditWordFormEquivalentSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormInformationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditWordFormVariationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
          <EditTemplateWordFormRelationSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
        </div>
      </section>
    );

  }
);