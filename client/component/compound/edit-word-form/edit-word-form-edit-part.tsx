//

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon} from "zographia";
import {EditWordFormRelationSection} from "/client/component/compound/edit-word-form/edit-word-form-relation-section";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditWordFormBasicSection} from "./edit-word-form-basic-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormPhraseSection} from "./edit-word-form-phrase-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditWordFormEditPart = create(
  require("./edit-word-form-edit-part.scss"), "EditWordFormEditPart",
  function ({
    dictionary,
    formSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditWordSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {form} = formSpec;

    const {control} = form;
    const {fields: sections, ...sectionOperations} = useFieldArray({control, name: "sections"});

    const addSection = useCallback(function (): void {
      sectionOperations.append({
        equivalents: [{titles: [], nameString: "", hidden: false}],
        informations: [],
        phrases: [],
        variations: [],
        relations: []
      });
    }, [sectionOperations]);

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <EditWordFormBasicSection dictionary={dictionary} form={form}/>
          {sections.map((section, sectionIndex) => (
            <div styleName="section" key={section.id}>
              <EditWordFormEquivalentSection dictionary={dictionary} sectionOperations={sectionOperations} sectionIndex={sectionIndex} form={form as any}/>
              <EditWordFormInformationSection dictionary={dictionary} form={form as any}/>
              <EditWordFormPhraseSection dictionary={dictionary} form={form as any}/>
              <EditWordFormVariationSection dictionary={dictionary} form={form as any}/>
              <EditWordFormRelationSection dictionary={dictionary} form={form}/>
            </div>
          ))}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addSection}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
            </Button>
          </div>
        </div>
      </form>
    );

  }
);