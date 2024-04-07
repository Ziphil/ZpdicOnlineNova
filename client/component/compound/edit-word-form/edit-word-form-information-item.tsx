/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  IconButton,
  Input,
  SuggestionSpec,
  Textarea,
  data,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {useEditWordFormDndItem} from "./edit-word-form-dnd";
import {EditWordSpec} from "./edit-word-form-hook";


export const EditWordFormInformationItem = create(
  require("./edit-word-form-equivalent-item.scss"), "EditWordFormInformationItem",
  function ({
    dictionary,
    form,
    informationOperations,
    dndId,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    form: EditWordSpec["form"],
    informationOperations: Omit<UseFieldArrayReturn<any, "informations">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps, dragging} = useEditWordFormDndItem(dndId);

    const suggestInformationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "information"}, {ignoreError: true});
        return switchResponse(response, (titles) => {
          const suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        }, () => {
          return [];
        });
      } catch {
        return [];
      }
    }, [dictionary.number]);

    return (
      <div styleName="root" {...data({dragging})} {...rest} {...paneProps}>
        <div styleName="grip" {...gripProps}>
          <GeneralIcon icon={faGripVertical}/>
        </div>
        <fieldset styleName="field-list">
          <ControlContainer>
            <ControlLabel>{trans("label.information.title")}</ControlLabel>
            <Input suggest={suggestInformationTitle} {...register(`informations.${index}.title`)}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.information.text")}</ControlLabel>
            <Textarea styleName="textarea" {...register(`informations.${index}.text`)}/>
          </ControlContainer>
        </fieldset>
        <div styleName="minus">
          <IconButton scheme="gray" variant="light" label={trans("discard.information")} onClick={() => informationOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </IconButton>
        </div>
      </div>
    );

  }
);