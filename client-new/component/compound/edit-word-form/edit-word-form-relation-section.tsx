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
  SuggestionSpec,
  TagInput,
  useTrans
} from "zographia";
import {RelationWordSelect} from "/client-new/component/atom/relation-word-select";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {EditWordFormSpec} from "./edit-word-form-hook";


export const EditWordFormRelationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormRelationSection",
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
    const {fields: relations, ...relationOperations} = useFieldArray({control, name: "relations"});

    const addRelation = useCallback(function (): void {
      relationOperations.append({
        tempId: nanoid(),
        titles: [],
        word: null
      });
    }, [relationOperations]);

    const suggestRelationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "relation"}, {ignoreError: true});
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
        <h3 styleName="heading">{trans("heading.relations")}</h3>
        <div styleName="item-list">
          {(relations.length > 0) ? relations.map((relation, index) => (
            <div styleName="item" key={relation.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.relation.titles")}</ControlLabel>
                  <Controller name={`relations.${index}.titles`} control={form.control} render={({field}) => (
                    <TagInput values={field.value} suggest={suggestRelationTitle} onSet={field.onChange}/>
                  )}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.relation.name")}</ControlLabel>
                  <Controller name={`relations.${index}.word`} control={form.control} render={({field}) => (
                    <RelationWordSelect dictionary={dictionary} word={field.value} onSet={field.onChange}/>
                  )}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => relationOperations.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          )) : (
            <p styleName="absent">
              {trans("absent.relation")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addRelation}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.relation")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);