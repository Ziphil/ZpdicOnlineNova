//

import {BaseSyntheticEvent, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {testIdentifier} from "/client/util/validation";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  paramName: string().test(testIdentifier("invalid")).max(30, "tooLong")
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
  const navigate = useNavigate();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionaryParamName", {number: dictionary.number, paramName: value.paramName ?? ""});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === value.paramName);
      navigate(`/dictionary/${value.paramName || dictionary.number}/settings`, {replace: true});
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionaryParamName");
    });
  }), [dictionary.number, dictionary.paramName, request, navigate, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}