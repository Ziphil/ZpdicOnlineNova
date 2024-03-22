//

import {BaseSyntheticEvent, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {useMe} from "/client/hook/auth";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  name: string().required("required")
});
const DEFAULT_VALUE = {
  name: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type AddDictionarySpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => void
};

export function useAddDictionary(): AddDictionarySpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const me = useMe();
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const navigate = useNavigate();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    await form.handleSubmit(async (value) => {
      const response = await request("createDictionary", {name: value.name});
      await switchResponse(response, async (dictionary) => {
        await invalidateResponses("fetchUserDictionaries", (query) => query.name === me?.name);
        await onSubmit?.();
        navigate(`/dictionary/${dictionary.number}`);
        dispatchSuccessToast("addDictionary");
      });
    })(event);
  }, [request, me, navigate, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}