//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  secret: string().oneOf(["true", "false"]).required()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionarySecretSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionarySecret(dictionary: Dictionary): ChangeDictionarySecretSpec {
  const form = useForm<FormValue>(SCHEMA, {secret: (dictionary.secret) ? "true" : "false"}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySecret", {number: dictionary.number, secret: value.secret === "true"});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (data) => +data.identifier === dictionary.number || data.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionarySecret");
    });
  }), [dictionary.number, dictionary.paramName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}