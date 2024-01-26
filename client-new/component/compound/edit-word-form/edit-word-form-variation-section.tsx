/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {nanoid} from "nanoid";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormSpec} from "./edit-word-form-hook";


export const EditWordFormVariationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormVariationSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditWordFormSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register, control} = form;
    const {fields: variations, ...variationOperations} = useFieldArray({control, name: "variations"});

    const addVariation = useCallback(function (): void {
      variationOperations.append({
        tempId: nanoid(),
        title: "",
        name: ""
      });
    }, [variationOperations]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.variations")}</h3>
        <div styleName="item-list">
          {(variations.length > 0) ? variations.map((variation, index) => (
            <div styleName="item" key={variation.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.variation.title")}</ControlLabel>
                  <Input {...register(`variations.${index}.title`)}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.variation.name")}</ControlLabel>
                  <Input {...register(`variations.${index}.name`)}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => variationOperations.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          )) : (
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