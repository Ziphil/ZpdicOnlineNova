/* eslint-disable react/jsx-closing-bracket-location */

import {faTimes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  GeneralIcon,
  GrabbablePane,
  GrabbablePaneBody,
  GrabbablePaneGrip,
  GrabbablePaneGripContainer,
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

    const {paneProps, paneRef, gripProps, dragging} = useEditExampleFormDndItem(dndId);

    return (
      <GrabbablePane styleName="root" dragging={dragging} ref={paneRef} {...rest} {...paneProps}>
        <GrabbablePaneGripContainer>
          <GrabbablePaneGrip {...gripProps}/>
        </GrabbablePaneGripContainer>
        <GrabbablePaneBody styleName="body">
          <fieldset styleName="field-list">
            <ControlContainer styleName="field-item" {...data({checkable: true})}>
              <Controller name={`words.${index}`} control={form.control} render={({field}) => (
                <RelationWordSelect dictionary={dictionary} word={field.value} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
          </fieldset>
          <div styleName="minus">
            <IconButton scheme="gray" variant="light" label={trans("discard.word")} onClick={() => wordOperations.remove(index)}>
              <GeneralIcon icon={faTimes}/>
            </IconButton>
          </div>
        </GrabbablePaneBody>
      </GrabbablePane>
    );

  }
);