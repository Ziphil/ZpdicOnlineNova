/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo} from "react";
import {UseFieldArrayReturn, UseFormReturn, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {SwapAnimationContext} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordFormValue} from "./edit-word-form-hook";
import {EditWordFormVariationItem} from "./edit-word-form-variation-item";


export const EditWordFormVariationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormVariationSection",
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
    const variationFieldArraySpec = useFieldArray({control, name: `sections.${sectionIndex}.variations`});
    const variationOperations = useMemo(() => ({
      append: variationFieldArraySpec.append,
      insert: variationFieldArraySpec.insert,
      update: variationFieldArraySpec.update,
      remove: variationFieldArraySpec.remove
    }), [variationFieldArraySpec]);

    const variations = variationFieldArraySpec.fields;

    const addVariation = useCallback(function (): void {
      variationOperations.append({title: "", spelling: "", pronunciation: ""});
    }, [variationOperations]);

    const setVariations = useCallback(function (update: (variations: Array<any>) => Array<any>): void {
      sectionOperations.update(sectionIndex, {...getValues(`sections.${sectionIndex}`), variations: update(getValues(`sections.${sectionIndex}.variations`))});
    }, [sectionIndex, getValues, sectionOperations]);

    return (
      <section styleName="root" {...rest}>
        <h4 styleName="heading">{trans("heading.variations")}</h4>
        <div styleName="list">
          {(variations.length > 0) ? (
            <SwapAnimationContext values={variations} setValues={setVariations}>
              <EditWordFormDndContext values={variations} setValues={setVariations}>
                {variations.map((variation, index) => (
                  <EditWordFormVariationItem
                    styleName="item"
                    key={variation.id}
                    dictionary={dictionary}
                    form={form}
                    variationOperations={variationOperations as any}
                    dndId={variation.id}
                    sectionIndex={sectionIndex}
                    variationIndex={index}
                  />
                ))}
              </EditWordFormDndContext>
            </SwapAnimationContext>
          ) : (
            <p styleName="absent">
              {trans("absent.variation")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addVariation}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.variation")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);