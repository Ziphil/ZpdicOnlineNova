/* eslint-disable react/jsx-closing-bracket-location */

import {faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller, UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  IconButton,
  Input,
  useTrans
} from "zographia";
import {WordModeSelect} from "/client/component/atom/word-mode-select";
import {WordTypeSelect} from "/client/component/atom/word-type-select";
import {create} from "/client/component/create";
import {WORD_TYPES} from "/server/internal/skeleton";
import {SearchWordAdvancedSpec} from "./search-word-advanced-dialog-hook";


export const SearchWordAdvancedDialogElementItem = create(
  require("./search-word-advanced-dialog-element-item.scss"), "SearchWordAdvancedDialogElementItem",
  function ({
    form,
    elementOperations,
    index,
    ...rest
  }: {
    form: SearchWordAdvancedSpec["form"],
    elementOperations: Omit<UseFieldArrayReturn<any, "elements">, "fields">,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchWordAdvancedDialog");

    const {register, control, watch} = form;

    const mode = watch(`elements.${index}.mode`);
    const showTitle = mode === "equivalent" || mode === "information" || mode === "variation" || mode === "relation";

    return (
      <div styleName="root" {...rest}>
        <fieldset styleName="field-list">
          <div styleName="row">
            <ControlContainer>
              <ControlLabel>{trans("label.mode")}</ControlLabel>
              <Controller name={`elements.${index}.mode`} control={control} render={({field}) => (
                <WordModeSelect optionModes={FORM_WORD_MODES} kind="select" mode={field.value} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
            <ControlContainer>
              <ControlLabel>{trans("label.type")}</ControlLabel>
              <Controller name={`elements.${index}.type`} control={control} render={({field}) => (
                <WordTypeSelect optionTypes={WORD_TYPES} kind="select" type={field.value} onSet={field.onChange}/>
              )}/>
            </ControlContainer>
            {(showTitle) && (
              <ControlContainer>
                <ControlLabel>{trans("label.title")}</ControlLabel>
                <Input {...register(`elements.${index}.title`)}/>
              </ControlContainer>
            )}
          </div>
          <ControlContainer>
            <ControlLabel>{trans("label.text")}</ControlLabel>
            <Input {...register(`elements.${index}.text`)}/>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <IconButton scheme="gray" variant="light" label={trans("discard.equivalent")} onClick={() => elementOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </IconButton>
        </div>
      </div>
    );

  }
);


const FORM_WORD_MODES = ["name", "equivalent", "tag", "information", "variation", "relation", "content"] as const;