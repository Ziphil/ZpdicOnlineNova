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
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {EditTemplateWordSpec} from "./edit-template-word-form-hook";
import {EditTemplateWordFormRelationItem} from "./edit-template-word-form-relation-item";
import {EditWordFormDndContext} from "./edit-word-form-dnd";


export const EditTemplateWordFormRelationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditTemplateWordFormRelationSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditTemplateWordSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control, getValues, setValue} = form;
    const {fields: relations, ...relationOperations} = useFieldArray({control, name: "relations"});

    const addRelation = useCallback(function (): void {
      relationOperations.append({
        titles: []
      });
    }, [relationOperations]);

    const setRelations = useCallback(function (update: (relations: Array<any>) => Array<any>): void {
      setValue("relations", update(getValues("relations")));
    }, [getValues, setValue]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.relations")}</h3>
        <div styleName="list">
          {(relations.length > 0) ? (
            <EditWordFormDndContext values={relations} setValues={setRelations}>
              {relations.map((relation, index) => (
                <EditTemplateWordFormRelationItem
                  styleName="item"
                  key={relation.id}
                  dictionary={dictionary}
                  form={form}
                  relationOperations={relationOperations}
                  dndId={relation.id}
                  index={index}
                />
              ))}
            </EditWordFormDndContext>
          ) : (
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