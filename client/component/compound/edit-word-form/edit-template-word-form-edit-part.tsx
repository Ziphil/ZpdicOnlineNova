//

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormBasicSection} from "./edit-template-word-form-basic-section";
import {EditTemplateWordSpec} from "./edit-template-word-form-hook";
import {EditTemplateWordFormSectionSection} from "./edit-template-word-form-section-section";


export const EditTemplateWordFormEditPart = create(
  require("./edit-word-form-edit-part.scss"), "EditTemplateWordFormEditPart",
  function ({
    dictionary,
    formSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditTemplateWordSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {form} = formSpec;

    const {control} = form;
    const {fields: sections, ...sectionOperations} = useFieldArray({control, name: "sections"});

    const addSection = useCallback(function (): void {
      sectionOperations.append({
        equivalents: [{titles: [], termString: "", hidden: false}],
        informations: [],
        phrases: [],
        variations: [],
        relations: []
      });
    }, [sectionOperations]);

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <EditTemplateWordFormBasicSection dictionary={dictionary} form={form}/>
          <div styleName="section-list">
            {sections.map((section, sectionIndex) => (
              <EditTemplateWordFormSectionSection
                key={section.id}
                dictionary={dictionary}
                form={form}
                sectionOperations={sectionOperations}
                sectionIndex={sectionIndex}
              />
            ))}
            <div styleName="section-plus">
              <Button scheme="secondary" variant="light" onClick={addSection}>
                <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                {trans("button.add.section")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    );

  }
);