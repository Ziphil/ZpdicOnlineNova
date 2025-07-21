//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  source: string()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionarySourceSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionarySource(dictionary: Dictionary, language: "akrantiain" | "zatlin"): ChangeDictionarySourceSpec {
  const form = useForm<FormValue>(SCHEMA, {source: dictionary.settings[`${language}Source`]}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", {number: dictionary.number, settings: {[`${language}Source`]: value.source ?? ""}});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast(`changeDictionarySettings.${language}Source`);
    });
  }), [dictionary.number, dictionary.paramName, language, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}