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
  explanation: string()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryExplanationSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryExplanation(dictionary: Dictionary): ChangeDictionaryExplanationSpec {
  const form = useForm<FormValue>(SCHEMA, {explanation: dictionary.explanation}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionaryExplanation", {number: dictionary.number, explanation: value.explanation ?? ""});
    await switchResponse(response, async () => {
      dispatchSuccessToast("changeDictionaryExplanation");
      await invalidateResponses("fetchDictionary", (data) => data.number === dictionary.number);
    });
  }), [dictionary.number, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}