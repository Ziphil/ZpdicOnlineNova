/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {nanoid} from "nanoid";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
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
  require("./edit-word-form-variation-section.scss"), "EditWordFormVariationSection",
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
    const variationsSpec = useFieldArray({control, name: "variations"});

    const addVariation = useCallback(function (): void {
      variationsSpec.append({
        tempId: nanoid(),
        title: "",
        name: ""
      });
    }, [variationsSpec]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.variations")}</h3>
        <div styleName="item-list">
          {variationsSpec.fields.map((variation, index) => (
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
                  <Input styleName="textarea" {...register(`variations.${index}.name`)}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => variationsSpec.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          ))}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addVariation}>
              <GeneralIcon icon={faPlus}/>
            </Button>
          </div>
        </div>
      </section>
    );

  }
);