//

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo} from "react";
import {useFieldArray} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditWordFormBasicSection} from "./edit-word-form-basic-section";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormSectionSection} from "./edit-word-form-section-section";


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

    const {trans} = useTrans("editWordForm");

    const {form} = formSpec;

    const {control} = form;
    const sectionFieldArraySpec = useFieldArray({control, name: "sections"});
    const sectionOperations = useMemo(() => ({
      append: sectionFieldArraySpec.append,
      update: sectionFieldArraySpec.update,
      remove: sectionFieldArraySpec.remove
    }), [sectionFieldArraySpec]);

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
          <EditWordFormBasicSection dictionary={dictionary} form={form}/>
          {(dictionary.settings.enableAdvancedWord) ? (
            <div styleName="section-list">
              {sectionFieldArraySpec.fields.map((section, sectionIndex) => (
                <EditWordFormSectionSection
                  key={section.id}
                  dictionary={dictionary}
                  form={form}
                  sectionOperations={sectionOperations}
                  sectionIndex={sectionIndex}
                  multiple={true}
                />
              ))}
              <div styleName="section-plus">
                <Button scheme="gray" variant="solid" onClick={addSection}>
                  <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                  {trans("button.add.section")}
                </Button>
              </div>
            </div>
          ) : (
            <div styleName="section-list">
              <EditWordFormSectionSection
                dictionary={dictionary}
                form={form}
                sectionOperations={sectionOperations}
                sectionIndex={0}
                multiple={false}
              />
            </div>
          )}
        </div>
      </form>
    );

  }
);