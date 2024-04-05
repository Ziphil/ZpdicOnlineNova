//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {DICTIONARY_VISIBILITIES, Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  visibility: string().oneOf(DICTIONARY_VISIBILITIES).required()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryVisibilitySpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryVisibility(dictionary: Dictionary): ChangeDictionaryVisibilitySpec {
  const form = useForm<FormValue>(SCHEMA, {visibility: dictionary.visibility}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionaryVisibility", {number: dictionary.number, visibility: value.visibility});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionaryVisibility");
    });
  }), [dictionary.number, dictionary.paramName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}