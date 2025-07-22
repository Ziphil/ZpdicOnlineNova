//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  phraseTitle: string(),
  exampleTitle: string()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryWordCardTitlesSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryWordCardTitles(dictionary: Dictionary): ChangeDictionaryWordCardTitlesSpec {
  const form = useForm<FormValue>(SCHEMA, {phraseTitle: dictionary.settings.phraseTitle, exampleTitle: dictionary.settings.exampleTitle}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", {number: dictionary.number, settings: {phraseTitle: value.phraseTitle ?? "", exampleTitle: value.exampleTitle ?? ""}});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionaryWordCardTitles");
    });
  }), [dictionary.number, dictionary.paramName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}