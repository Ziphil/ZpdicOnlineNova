/* eslint-disable react/jsx-closing-bracket-location */

import {faImage, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback, useMemo} from "react";
import {UseFieldArrayReturn, UseFormReturn, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {ResourceListDialog} from "/client/component/compound/resource-list-dialog";
import {create} from "/client/component/create";
import {SwapAnimationContext} from "/client/util/swap-animation";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormValue} from "./edit-template-word-form-hook";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordFormValue} from "./edit-word-form-hook";
import {EditWordFormInformationItem} from "./edit-word-form-information-item";


export const EditWordFormInformationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormInformationSection",
  function ({
    dictionary,
    form,
    sectionOperations,
    sectionIndex,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: UseFormReturn<EditWordFormValue | EditTemplateWordFormValue>,
    sectionOperations: Pick<UseFieldArrayReturn<any, "sections">, "append" | "update" | "remove">,
    sectionIndex: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {control, getValues} = form;
    const informationFieldArraySpec = useFieldArray({control, name: `sections.${sectionIndex}.informations`});
    const informationOperations = useMemo(() => ({
      append: informationFieldArraySpec.append,
      update: informationFieldArraySpec.update,
      remove: informationFieldArraySpec.remove
    }), [informationFieldArraySpec]);

    const informations = informationFieldArraySpec.fields;

    const addInformation = useCallback(function (): void {
      informationOperations.append({title: "", text: "", hidden: false});
    }, [informationOperations]);

    const setInformations = useCallback(function (update: (informations: Array<any>) => Array<any>): void {
      sectionOperations.update(sectionIndex, {...getValues(`sections.${sectionIndex}`), informations: update(getValues(`sections.${sectionIndex}.informations`))});
    }, [sectionIndex, getValues, sectionOperations]);

    return (
      <section styleName="root" {...rest}>
        <h4 styleName="heading">{trans("heading.informations")}</h4>
        <div styleName="list">
          {(informations.length > 0) ? (
            <SwapAnimationContext values={informations} setValues={setInformations} move={informationFieldArraySpec.move}>
              <EditWordFormDndContext values={informations} setValues={setInformations} move={informationFieldArraySpec.move}>
                {informations.map((information, index) => (
                  <EditWordFormInformationItem
                    styleName="item"
                    key={information.id}
                    dictionary={dictionary}
                    form={form}
                    informationOperations={informationOperations as any}
                    dndId={information.id}
                    sectionIndex={sectionIndex}
                    informationIndex={index}
                  />
                ))}
              </EditWordFormDndContext>
            </SwapAnimationContext>
          ) : (
            <p styleName="absent">
              {trans("absent.information")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addInformation}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.information")}
            </Button>
            <ResourceListDialog dictionary={dictionary} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faImage}/></ButtonIconbag>
                {trans("button.resource")}
              </Button>
            )}/>
          </div>
        </div>
      </section>
    );

  }
);