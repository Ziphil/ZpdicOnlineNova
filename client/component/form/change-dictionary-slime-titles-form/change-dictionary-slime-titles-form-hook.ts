//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  pronunciationTitle: string()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionarySlimeTitlesSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionarySlimeTitles(dictionary: Dictionary): ChangeDictionarySlimeTitlesSpec {
  const form = useForm<FormValue>(SCHEMA, {pronunciationTitle: dictionary.settings.pronunciationTitle}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", {number: dictionary.number, settings: {pronunciationTitle: value.pronunciationTitle ?? ""}});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionarySlimeTitles");
    });
  }), [dictionary.number, dictionary.paramName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}