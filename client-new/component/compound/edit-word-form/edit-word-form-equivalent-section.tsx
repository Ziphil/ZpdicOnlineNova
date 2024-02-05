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
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordFormEquivalentItem} from "./edit-word-form-equivalent-item";
import {EditWordSpec} from "./edit-word-form-hook";


export const EditWordFormEquivalentSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormEquivalentSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {control} = form;
    const {fields: equivalents, ...equivalentOperations} = useFieldArray({control, name: "equivalents"});

    const addEquivalent = useCallback(function (): void {
      equivalentOperations.append({
        titles: [],
        nameString: ""
      });
    }, [equivalentOperations]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.equivalents")}</h3>
        <div styleName="item-list">
          {(equivalents.length > 0) ? (
            <EditWordFormDndContext values={equivalents} valueOperations={equivalentOperations}>
              {equivalents.map((equivalent, index) => (
                <EditWordFormEquivalentItem
                  styleName="item"
                  key={equivalent.id}
                  dictionary={dictionary}
                  form={form}
                  dndId={equivalent.id}
                  index={index}
                />
              ))}
            </EditWordFormDndContext>
          ) : (
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