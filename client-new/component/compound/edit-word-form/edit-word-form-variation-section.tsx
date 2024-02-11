/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormVariationItem} from "./edit-word-form-variation-item";


export const EditWordFormVariationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormVariationSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control} = form;
    const {fields: variations, ...variationOperations} = useFieldArray({control, name: "variations"});

    const addVariation = useCallback(function (): void {
      variationOperations.append({
        title: "",
        name: ""
      });
    }, [variationOperations]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.variations")}</h3>
        <div styleName="item-list">
          {(variations.length > 0) ? (
            <EditWordFormDndContext values={variations} valueOperations={variationOperations}>
              {variations.map((variation, index) => (
                <EditWordFormVariationItem
                  className="item"
                  key={variation.id}
                  dictionary={dictionary}
                  form={form}
                  dndId={variation.id}
                  index={index}
                />
              ))}
            </EditWordFormDndContext>
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