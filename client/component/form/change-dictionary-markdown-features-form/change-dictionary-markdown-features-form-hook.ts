//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, array, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary, MARKDOWN_FEATURES} from "/server/internal/skeleton";
import type {RequestData} from "/server/internal/type/rest";


const SCHEMA = object({
  enable: string().oneOf(["true", "false"]).required(),
  features: array(string().oneOf(MARKDOWN_FEATURES).required()).required()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryMarkdownFeaturesSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryMarkdownFeatures(dictionary: Dictionary): ChangeDictionaryMarkdownFeaturesSpec {
  const form = useForm<FormValue>(SCHEMA, getDefaultFormValue(dictionary), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", getQuery(dictionary, value));
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionarySettings.markdownFeatures");
    });
  }), [dictionary, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getDefaultFormValue(dictionary: Dictionary): FormValue {
  return {
    enable: (dictionary.settings.markdownFeatures.length > 0) ? "true" : "false",
    features: dictionary.settings.markdownFeatures.filter((feature) => feature !== "basic")
  };
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"changeDictionarySettings"> {
  const number = dictionary.number;
  return {
    number,
    settings: {
      markdownFeatures: (value.enable === "true") ? ["basic", ...value.features] : []
    }
  };
}
