//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";
import {IDENTIFIER_REGEXP} from "/client-new/util/validation";


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
      await invalidateResponses("fetchDictionary", (data) => data.number === dictionary.number);
      dispatchSuccessToast("changeDictionaryParamName");
    });
  }), [dictionary.number, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}