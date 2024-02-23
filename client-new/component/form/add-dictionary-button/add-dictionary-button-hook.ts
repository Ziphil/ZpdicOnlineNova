//

import {BaseSyntheticEvent, useCallback} from "react";
import {UseFormReturn} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {useMe} from "/client-new/hook/auth";
import {useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {switchResponse} from "/client-new/util/response";


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
      await switchResponse(response, async (body) => {
        await invalidateResponses("fetchUserDictionaries", (request) => request.name === me?.name);
        await onSubmit?.();
        navigate(`/dictionary/${body.number}`);
        dispatchSuccessToast("createDictionary");
      });
    })(event);
  }, [request, me, navigate, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}