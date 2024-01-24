/* eslint-disable react/jsx-closing-bracket-location */
//

import {ReactElement} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
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

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.equivalents")}</h3>
        <div>
          {equivalentsSpec.fields.map((equivalent, index) => (
            <fieldset styleName="control" key={equivalent.tempId}>
              <ControlContainer>
                <ControlLabel>{trans("label.equivalent.title")}</ControlLabel>
                <Controller name={`equivalents.${index}.titles`} control={form.control} render={({field}) => (
                  <TagInput values={field.value} onSet={field.onChange}/>
                )}/>
              </ControlContainer>
              <ControlContainer>
                <ControlLabel>{trans("label.equivalent.names")}</ControlLabel>
                <Input {...register(`equivalents.${index}.nameString`)}/>
              </ControlContainer>
            </fieldset>
          ))}
        </div>
      </section>
    );

  }
);