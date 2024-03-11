/* eslint-disable react/jsx-closing-bracket-location */

import {faImage, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {ResourceListDialog} from "/client/component/compound/resource-list-dialog";
import {create} from "/client/component/create";
import {EnhancedDictionary} from "/client/skeleton";
import {EditWordFormDndContext} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormInformationItem} from "./edit-word-form-information-item";


export const EditWordFormInformationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormInformationSection",
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

    const {control, getValues, setValue} = form;
    const {fields: informations, ...informationOperations} = useFieldArray({control, name: "informations"});

    const addInformation = useCallback(function (): void {
      informationOperations.append({
        title: "",
        text: ""
      });
    }, [informationOperations]);

    const setInformations = useCallback(function (update: (informations: Array<any>) => Array<any>): void {
      setValue("informations", update(getValues("informations")));
    }, [getValues, setValue]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.informations")}</h3>
        <div styleName="list">
          {(informations.length > 0) ? (
            <EditWordFormDndContext values={informations} setValues={setInformations}>
              {informations.map((information, index) => (
                <EditWordFormInformationItem
                  styleName="item"
                  key={information.id}
                  dictionary={dictionary}
                  form={form}
                  informationOperations={informationOperations}
                  dndId={information.id}
                  index={index}
                />
              ))}
            </EditWordFormDndContext>
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