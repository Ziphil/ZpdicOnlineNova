//

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo} from "react";
import {useFieldArray} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {SwapAnimationContext} from "/client/util/swap-animation";
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

    const {control, setValue} = form;
    const sectionFieldArraySpec = useFieldArray({control, name: "sections"});
    const sectionOperations = useMemo(() => ({
      append: sectionFieldArraySpec.append,
      update: sectionFieldArraySpec.update,
      remove: sectionFieldArraySpec.remove
    }), [sectionFieldArraySpec]);

    const sections = sectionFieldArraySpec.fields;

    const setSections = useCallback(function (update: (sections: Array<any>) => Array<any>): void {
      setValue("sections", update(sections));
    }, [sections, setValue]);

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
              <SwapAnimationContext values={sections} setValues={setSections}>
                {sections.map((section, sectionIndex) => (
                  <EditWordFormSectionSection
                    key={section.id}
                    dictionary={dictionary}
                    form={form}
                    sectionOperations={sectionOperations}
                    dndId={section.id}
                    sectionIndex={sectionIndex}
                    multiple={true}
                  />
                ))}
              </SwapAnimationContext>
              <div styleName="section-plus">
                <Button scheme="gray" variant="solid" onClick={addSection}>
                  <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                  {trans("button.add.section")}
                </Button>
              </div>
            </div>
          ) : (
            <div styleName="section-list">
              <SwapAnimationContext values={sections} setValues={setSections}>
                <EditWordFormSectionSection
                  dictionary={dictionary}
                  form={form}
                  sectionOperations={sectionOperations}
                  dndId="section"
                  sectionIndex={0}
                  multiple={false}
                />
              </SwapAnimationContext>
            </div>
          )}
        </div>
      </form>
    );

  }
);