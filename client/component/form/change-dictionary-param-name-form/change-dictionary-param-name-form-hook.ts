//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";
import {IDENTIFIER_REGEXP} from "/client/util/validation";


const SCHEMA = object({
  paramName: string().matches(IDENTIFIER_REGEXP, "invalid").max(30, "tooLong")
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryParamNameSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryParamName(dictionary: Dictionary): ChangeDictionaryParamNameSpec {
  const form = useForm<FormValue>(SCHEMA, {paramName: dictionary.paramName}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionaryParamName", {number: dictionary.number, paramName: value.paramName ?? ""});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionaryParamName");
    });
  }), [dictionary.number, dictionary.paramName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}