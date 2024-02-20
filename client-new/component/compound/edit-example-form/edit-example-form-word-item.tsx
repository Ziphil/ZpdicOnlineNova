/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  GeneralIcon,
  useTrans
} from "zographia";
import {RelationWordSelect} from "/client-new/component/atom/relation-word-select";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {useEditExampleFormDndItem} from "./edit-example-form-dnd";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormWordItem = create(
  require("./edit-example-form-word-item.scss"), "EditExampleFormWordItem",
  function ({
    dictionary,
    form,
    dndId,
    index,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditExampleSpec["form"],
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editExampleForm");

    const {register, control} = form;
    const {fields: words, ...equivalentOperations} = useFieldArray({control, name: "words"});
    const {paneProps, gripProps} = useEditExampleFormDndItem(dndId);

    return (
      <div styleName="root" {...rest} {...paneProps}>
        <div styleName="grip" {...gripProps}>
          <GeneralIcon icon={faGripVertical}/>
        </div>
        <fieldset styleName="field-list">
          <ControlContainer>
            <Controller name={`words.${index}`} control={form.control} render={({field}) => (
              <RelationWordSelect dictionary={dictionary} word={field.value} onSet={field.onChange}/>
            )}/>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <Button scheme="gray" variant="light" onClick={() => equivalentOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </Button>
        </div>
      </div>
    );

  }
);