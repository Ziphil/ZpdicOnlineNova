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
import {SearchWordAdvancedDialogElementItem} from "./search-word-advanced-dialog-element-item";
import {SearchWordAdvancedSpec} from "./search-word-advanced-dialog-hook";


export const SearchWordAdvancedDialogElementSection = create(
  require("./search-word-advanced-dialog-element-section.scss"), "SearchWordAdvancedDialogElementSection",
  function ({
    form,
    ...rest
  }: {
    form: SearchWordAdvancedSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchWordAdvancedDialog");

    const {control} = form;
    const {fields: elements, ...elementOperations} = useFieldArray({control, name: "elements"});

    const addElement = useCallback(function (): void {
      elementOperations.append({
        text: "",
        title: "",
        mode: "spelling",
        type: "exact"
      });
    }, [elementOperations]);

    return (
      <section styleName="root" {...rest}>
        <div styleName="list">
          {(elements.length > 0) ? elements.map((variation, index) => (
            <SearchWordAdvancedDialogElementItem
              className="item"
              key={variation.id}
              form={form}
              elementOperations={elementOperations}
              index={index}
            />
          )) : (
            <p styleName="absent">
              {trans("absent.element")}
            </p>
          )}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addElement}>
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add.element")}
            </Button>
          </div>
        </div>
      </section>
    );

  }
);