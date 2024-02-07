//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {Asserts, object, string} from "yup";
import {useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


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
      dispatchSuccessToast("changeDictionarySecret");
      await invalidateResponses("fetchDictionary", (data) => data.number === dictionary.number);
    });
  }), [dictionary.number, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}