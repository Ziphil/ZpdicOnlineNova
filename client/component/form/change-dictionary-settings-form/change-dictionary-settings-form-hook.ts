//

import {BaseSyntheticEvent, useMemo} from "react";
import {StringSchema, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {testLinearRegexpPattern} from "/client/util/validation";
import {Dictionary, DictionarySettings} from "/server/internal/skeleton";
import type {RequestData} from "/server/internal/type/rest";


type FormValue = {value?: string};

export type ChangeDictionarySourceSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionarySettings<N extends keyof DictionarySettings>(dictionary: Dictionary, propertyName: N): ChangeDictionarySourceSpec {
  const schema = object({value: getSchema(propertyName)});
  const form = useForm<FormValue>(schema, getDefaultFormValue(dictionary, propertyName), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", getQuery(dictionary, propertyName, value));
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast(`changeDictionarySettings.${propertyName}`);
    });
  }), [dictionary, propertyName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getSchema<N extends keyof DictionarySettings>(propertyName: N): StringSchema {
  if (propertyName === "ignoredEquivalentPattern") {
    return string().test(testLinearRegexpPattern("invalidPattern"));
  } else {
    return string();
  }
}

function getDefaultFormValue<N extends keyof DictionarySettings>(dictionary: Dictionary, propertyName: N): FormValue {
  if (propertyName === "enableAdvancedWord" || propertyName === "enableMarkdown" || propertyName === "enableDuplicateName" || propertyName === "showEquivalentNumber") {
    return {value: dictionary.settings[propertyName]!.toString()};
  } else if (propertyName === "punctuations") {
    return {value: dictionary.settings.punctuations.join("")};
  } else {
    return {value: dictionary.settings[propertyName] as string};
  }
}

function getQuery<N extends keyof DictionarySettings>(dictionary: Dictionary, propertyName: N, value: FormValue): RequestData<"changeDictionarySettings"> {
  const number = dictionary.number;
  if (propertyName === "enableAdvancedWord" || propertyName === "enableMarkdown" || propertyName === "enableDuplicateName" || propertyName === "showEquivalentNumber") {
    return {number, settings: {[propertyName]: value.value === "true"}};
  } else if (propertyName === "punctuations") {
    return {number, settings: {punctuations: (value.value || "").split("")}};
  } else {
    return {number, settings: {[propertyName]: value.value}};
  }
}