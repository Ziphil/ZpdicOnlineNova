//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/type/rest/internal";


const SCHEMA = object({
  password: string().min(6, "tooShort").max(50, "tooLong").required("required")
});
const DEFAULT_VALUE = {
  password: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type ResetUserPasswordSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useResetUserPassword(tokenKey: string): ResetUserPasswordSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("resetUserPassword", getQuery(tokenKey, value), {useRecaptcha: true});
    await switchResponse(response, async () => {
      dispatchSuccessToast("resetUserPassword");
    });
  }), [tokenKey, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(tokenKey: string, value: FormValue): Omit<RequestData<"resetUserPassword">, "recaptchaToken"> {
  const query = {
    key: tokenKey,
    password: value.password
  };
  return query;
}