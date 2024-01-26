/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {nanoid} from "nanoid";
import {ReactElement, useCallback} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  SuggestionSpec,
  TagInput,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
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

    const {trans, transNode} = useTrans("editWordForm");

    const {register, control} = form;
    const {fields: equivalents, ...equivalentOperations} = useFieldArray({control, name: "equivalents"});

    const addEquivalent = useCallback(function (): void {
      equivalentOperations.append({
        tempId: nanoid(),
        titles: [],
        nameString: ""
      });
    }, [equivalentOperations]);

    const suggestEquivalentTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "equivalent"}, {ignoreError: true});
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
        <h3 styleName="heading">{trans("heading.equivalents")}</h3>
        <div styleName="item-list">
          {(equivalents.length > 0) ? equivalents.map((equivalent, index) => (
            <div styleName="item" key={equivalent.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.equivalent.titles")}</ControlLabel>
                  <Controller name={`equivalents.${index}.titles`} control={form.control} render={({field}) => (
                    <TagInput values={field.value} suggest={suggestEquivalentTitle} onSet={field.onChange}/>
                  )}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>
                    {transNode("label.equivalent.names", {
                      note: (parts) => <span styleName="note">{parts}</span>
                    })}
                  </ControlLabel>
                  <Input {...register(`equivalents.${index}.nameString`)}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => equivalentOperations.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          )) : (
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