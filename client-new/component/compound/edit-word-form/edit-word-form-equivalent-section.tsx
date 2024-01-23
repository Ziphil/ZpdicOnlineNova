/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {nanoid} from "nanoid";
import {ReactElement, useCallback} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  TagInput,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormSpec} from "./edit-word-form-hook";


export const EditWordFormEquivalentSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormEquivalentSection",
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
    const equivalentsSpec = useFieldArray({control, name: "equivalents"});

    const addEquivalent = useCallback(function (): void {
      equivalentsSpec.append({
        tempId: nanoid(),
        titles: [],
        nameString: ""
      });
    }, [equivalentsSpec]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.equivalents")}</h3>
        <div styleName="item-list">
          {equivalentsSpec.fields.map((equivalent, index) => (
            <div styleName="item" key={equivalent.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.equivalent.titles")}</ControlLabel>
                  <Controller name={`equivalents.${index}.titles`} control={form.control} render={({field}) => (
                    <TagInput values={field.value} onSet={field.onChange}/>
                  )}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.equivalent.names")}</ControlLabel>
                  <Input {...register(`equivalents.${index}.nameString`)}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => equivalentsSpec.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          ))}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addEquivalent}>
              <GeneralIcon icon={faPlus}/>
            </Button>
          </div>
        </div>
      </section>
    );

  }
);