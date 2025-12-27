/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo} from "react";
import {UseFieldArrayReturn, UseFormReturn, useFieldArray} from "react-hook-form";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {SwapAnimationContext} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordFormEquivalentItem} from "./edit-word-form-equivalent-item";
import {EditWordFormValue} from "./edit-word-form-hook";


export const EditWordFormEquivalentSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormEquivalentSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    sectionIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    sectionOperations: Pick<UseFieldArrayReturn<any, "sections">, "append" | "update" | "remove">,
    sectionIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control, getValues} = form;
    const equivalentFieldArraySpec = useFieldArray({control, name: `sections.${sectionIndex}.equivalents`});
    const equivalentOperations = useMemo(() => ({
      append: equivalentFieldArraySpec.append,
      insert: equivalentFieldArraySpec.insert,
      update: equivalentFieldArraySpec.update,
      remove: equivalentFieldArraySpec.remove
    }), [equivalentFieldArraySpec]);

    const equivalents = equivalentFieldArraySpec.fields;

    const setEquivalents = useCallback(function (update: (equivalents: Array<any>) => Array<any>): void {
      sectionOperations.update(sectionIndex, {...getValues(`sections.${sectionIndex}`), equivalents: update(getValues(`sections.${sectionIndex}.equivalents`))});
    }, [sectionIndex, getValues, sectionOperations]);

    const addEquivalent = useCallback(function (): void {
      equivalentOperations.append({titles: [], termString: "", hidden: false});
    }, [equivalentOperations]);

    return (
      <section styleName="root" {...rest}>
        <h4 styleName="heading">{trans("heading.equivalents")}</h4>
        <div styleName="list">
          {(equivalents.length > 0) ? (
            <SwapAnimationContext values={equivalents} setValues={setEquivalents}>
              <EditWordFormDndContext values={equivalents} setValues={setEquivalents}>
                {equivalents.map((equivalent, equivalentIndex) => (
                  <EditWordFormEquivalentItem
                    styleName="item"
                    key={equivalent.id}
                    dictionary={dictionary}
                    form={form}
                    equivalentOperations={equivalentOperations as any}
                    dndId={equivalent.id}
                    sectionIndex={sectionIndex}
                    equivalentIndex={equivalentIndex}
                  />
                ))}
              </EditWordFormDndContext>
            </SwapAnimationContext>
          ) : (
            <p styleName="absent">
              {trans("absent.equivalent")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addEquivalent}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.equivalent")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);