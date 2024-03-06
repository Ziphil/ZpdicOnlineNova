//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary, DictionarySettings} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";
import {RequestData} from "/server/controller/internal/type";


const SCHEMA = object({
  value: string()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionarySourceSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionarySettings<N extends keyof DictionarySettings>(dictionary: Dictionary, propertyName: N): ChangeDictionarySourceSpec {
  const form = useForm<FormValue>(SCHEMA, getDefaultFormValue(dictionary, propertyName), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", getQuery(dictionary, propertyName, value));
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (data) => data.number === dictionary.number);
      dispatchSuccessToast(`changeDictionarySettings.${propertyName}`);
    });
  }), [dictionary, propertyName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getDefaultFormValue<N extends keyof DictionarySettings>(dictionary: Dictionary, propertyName: N): FormValue {
  if (propertyName === "enableMarkdown" || propertyName === "enableDuplicateName") {
    return {value: dictionary.settings[propertyName]!.toString()};
  } else {
    return {value: dictionary.settings[propertyName] as string};
  }
}

function getQuery<N extends keyof DictionarySettings>(dictionary: Dictionary, propertyName: N, value: FormValue): RequestData<"changeDictionarySettings"> {
  const number = dictionary.number;
  if (propertyName === "enableMarkdown" || propertyName === "enableDuplicateName") {
    return {number, settings: {[propertyName]: value.value === "true"}};
  } else {
    return {number, settings: {[propertyName]: value.value}};
  }
}