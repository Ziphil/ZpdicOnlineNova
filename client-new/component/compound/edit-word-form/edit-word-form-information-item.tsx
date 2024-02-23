/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {UseFieldArrayReturn} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  SuggestionSpec,
  Textarea,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {switchResponse} from "/client-new/util/response";
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
    dictionary: EnhancedDictionary,
    form: EditWordSpec["form"],
    informationOperations: Omit<UseFieldArrayReturn<any, "informations">, "fields">,
    dndId: string,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register} = form;
    const {paneProps, gripProps} = useEditWordFormDndItem(dndId);

    const suggestInformationTitle = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const number = dictionary.number;
      try {
        const response = await request("suggestDictionaryTitles", {number, pattern, propertyName: "information"}, {ignoreError: true});
        return switchResponse(response, (data) => {
          const titles = data;
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
      <div styleName="root" {...rest} {...paneProps}>
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
          <Button scheme="gray" variant="light" onClick={() => informationOperations.remove(index)}>
            <GeneralIcon icon={faMinus}/>
          </Button>
        </div>
      </div>
    );

  }
);