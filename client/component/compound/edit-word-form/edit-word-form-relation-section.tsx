/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo} from "react";
import {UseFieldArrayReturn, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {SwapAnimationContext} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormRelationItem} from "./edit-word-form-relation-item";


export const EditWordFormRelationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormRelationSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    sectionIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditWordSpec["form"],
    sectionOperations: Pick<UseFieldArrayReturn<any, "sections">, "append" | "update" | "remove">,
    sectionIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control, getValues} = form;
    const relationFieldArraySpec = useFieldArray({control, name: `sections.${sectionIndex}.relations`});
    const relationOperations = useMemo(() => ({
      append: relationFieldArraySpec.append,
      insert: relationFieldArraySpec.insert,
      update: relationFieldArraySpec.update,
      remove: relationFieldArraySpec.remove
    }), [relationFieldArraySpec]);

    const relations = relationFieldArraySpec.fields;

    const addRelation = useCallback(function (): void {
      relationOperations.append({titles: [], word: null, mutual: false});
    }, [relationOperations]);

    const setRelations = useCallback(function (update: (relations: Array<any>) => Array<any>): void {
      sectionOperations.update(sectionIndex, {...getValues(`sections.${sectionIndex}`), relations: update(getValues(`sections.${sectionIndex}.relations`))});
    }, [sectionIndex, getValues, sectionOperations]);

    return (
      <section styleName="root" {...rest}>
        <h4 styleName="heading">{trans("heading.relations")}</h4>
        <div styleName="list">
          {(relations.length > 0) ? (
            <SwapAnimationContext values={relations} setValues={setRelations} move={relationFieldArraySpec.move}>
              <EditWordFormDndContext values={relations} setValues={setRelations} move={relationFieldArraySpec.move}>
                {relations.map((relation, index) => (
                  <EditWordFormRelationItem
                    styleName="item"
                    key={relation.id}
                    dictionary={dictionary}
                    form={form}
                    relationOperations={relationOperations as any}
                    dndId={relation.id}
                    sectionIndex={sectionIndex}
                    relationIndex={index}
                  />
                ))}
              </EditWordFormDndContext>
            </SwapAnimationContext>
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