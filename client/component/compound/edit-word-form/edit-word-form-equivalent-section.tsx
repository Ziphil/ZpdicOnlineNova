/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFormReturn, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordFormEquivalentItem} from "./edit-word-form-equivalent-item";
import {EditWordFormValue} from "./edit-word-form-hook";


export const EditWordFormEquivalentSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormEquivalentSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {control, getValues, setValue} = form;
    const {fields: equivalents, ...equivalentOperations} = useFieldArray({control, name: "sections.0.equivalents"});

    const addEquivalent = useCallback(function (): void {
      equivalentOperations.append({
        titles: [],
        nameString: "",
        hidden: false
      });
    }, [equivalentOperations]);

    const setEquivalents = useCallback(function (update: (equivalents: Array<any>) => Array<any>): void {
      setValue("sections.0.equivalents", update(getValues("sections.0.equivalents")));
    }, [getValues, setValue]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.equivalents")}</h3>
        <div styleName="list">
          {(equivalents.length > 0) ? (
            <EditWordFormDndContext values={equivalents} setValues={setEquivalents}>
              {equivalents.map((equivalent, index) => (
                <EditWordFormEquivalentItem
                  styleName="item"
                  key={equivalent.id}
                  dictionary={dictionary}
                  form={form}
                  equivalentOperations={equivalentOperations as any}
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