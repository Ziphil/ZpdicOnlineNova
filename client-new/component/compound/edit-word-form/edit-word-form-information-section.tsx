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
  Textarea,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormSpec} from "./edit-word-form-hook";


export const EditWordFormInformationSection = create(
  require("./edit-word-form-information-section.scss"), "EditWordFormInformationSection",
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
    const informationsSpec = useFieldArray({control, name: "informations"});

    const addInformation = useCallback(function (): void {
      informationsSpec.append({
        tempId: nanoid(),
        title: "",
        text: ""
      });
    }, [informationsSpec]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.informations")}</h3>
        <div styleName="item-list">
          {informationsSpec.fields.map((information, index) => (
            <div styleName="item" key={information.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.information.title")}</ControlLabel>
                  <Input {...register(`informations.${index}.title`)}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.information.text")}</ControlLabel>
                  <Textarea styleName="textarea" {...register(`informations.${index}.text`)}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => informationsSpec.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          ))}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addInformation}>
              <GeneralIcon icon={faPlus}/>
            </Button>
          </div>
        </div>
      </section>
    );

  }
);