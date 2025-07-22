/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  GeneralIcon,
  IconButton,
  data,
  useTrans
} from "zographia";
import {RelationWordSelect} from "/client/component/atom/relation-word-select";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {useEditExampleFormDndItem} from "./edit-example-form-dnd";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormWordItem = create(
  require("./edit-example-form-word-item.scss"), "EditExampleFormWordItem",
  function ({
    dictionary,
    form,
    wordOperations,
    dndId,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditExampleSpec["form"],
    wordOperations: Omit<UseFieldArrayReturn<any, "words">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {paneProps, gripProps, dragging} = useEditExampleFormDndItem(dndId);

    return (
      <div styleName="root" {...data({dragging})} {...rest} {...paneProps}>
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
          <IconButton scheme="gray" variant="light" label={trans("discard.word")} onClick={() => wordOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </IconButton>
        </div>
      </div>
    );

  }
);