//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


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
      await invalidateResponses("fetchDictionary", (data) => data.number === dictionary.number);
      dispatchSuccessToast(`changeDictionarySettings.${language}Source`);
    });
  }), [dictionary.number, language, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}