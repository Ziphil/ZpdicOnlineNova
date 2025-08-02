/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordSpec} from "./edit-template-word-form-hook";
import {EditTemplateWordFormRelationItem} from "./edit-template-word-form-relation-item";
import {EditWordFormDndContext} from "./edit-word-form-dnd";


export const EditTemplateWordFormRelationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditTemplateWordFormRelationSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    sectionIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditTemplateWordSpec["form"],
    sectionOperations: Omit<UseFieldArrayReturn<any, "sections">, "fields">,
    sectionIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control, getValues} = form;
    const {fields: relations, ...relationOperations} = useFieldArray({control, name: `sections.${sectionIndex}.relations`});

    const addRelation = useCallback(function (): void {
      relationOperations.append({
        titles: []
      });
    }, [relationOperations]);

    const setRelations = useCallback(function (update: (relations: Array<any>) => Array<any>): void {
      sectionOperations.update(sectionIndex, {...getValues(`sections.${sectionIndex}`), relations: update(getValues(`sections.${sectionIndex}.relations`))});
    }, [sectionIndex, getValues, sectionOperations]);

    return (
      <section styleName="root" {...rest}>
        <h4 styleName="heading">{trans("heading.relations")}</h4>
        <div styleName="list">
          {(relations.length > 0) ? (
            <EditWordFormDndContext values={relations} setValues={setRelations}>
              {relations.map((relation, index) => (
                <EditTemplateWordFormRelationItem
                  styleName="item"
                  key={relation.id}
                  dictionary={dictionary}
                  form={form}
                  relationOperations={relationOperations as any}
                  dndId={relation.id}
                  sectionIndex={sectionIndex}
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