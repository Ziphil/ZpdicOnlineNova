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
import {EnhancedDictionary} from "/client/skeleton";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormRelationItem} from "./edit-word-form-relation-item";


export const EditWordFormRelationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormRelationSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control} = form;
    const {fields: relations, ...relationOperations} = useFieldArray({control, name: "relations"});

    const addRelation = useCallback(function (): void {
      relationOperations.append({
        titles: [],
        word: null,
        mutual: false
      });
    }, [relationOperations]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.relations")}</h3>
        <div styleName="list">
          {(relations.length > 0) ? (
            <EditWordFormDndContext values={relations} valueOperations={relationOperations}>
              {relations.map((relation, index) => (
                <EditWordFormRelationItem
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