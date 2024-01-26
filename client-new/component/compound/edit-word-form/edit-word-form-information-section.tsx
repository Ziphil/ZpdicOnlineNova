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
  SuggestionSpec,
  Textarea,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {EditWordFormSpec} from "./edit-word-form-hook";


export const EditWordFormInformationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormInformationSection",
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
    const {fields: informations, ...informationsOperations} = useFieldArray({control, name: "informations"});

    const addInformation = useCallback(function (): void {
      informationsOperations.append({
        tempId: nanoid(),
        title: "",
        text: ""
      });
    }, [informationsOperations]);

    const suggestInformationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "information"}, {ignoreError: true});
        if (response.status === 200 && !("error" in response.data)) {
          const titles = response.data;
          const suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        } else {
          return [];
        }
      } catch {
        return [];
      }
    }, [dictionary.number]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.informations")}</h3>
        <div styleName="item-list">
          {(informations.length > 0) ? informations.map((information, index) => (
            <div styleName="item" key={information.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.information.title")}</ControlLabel>
                  <Input suggest={suggestInformationTitle} {...register(`informations.${index}.title`)}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.information.text")}</ControlLabel>
                  <Textarea styleName="textarea" {...register(`informations.${index}.text`)}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => informationsOperations.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          )) : (
            <p styleName="absent">
              {trans("absent.information")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addInformation}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.information")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);