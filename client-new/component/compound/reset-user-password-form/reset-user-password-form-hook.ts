//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client-new/hook/form";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {switchResponse} from "/client-new/util/response";
import type {RequestData} from "/server/controller/internal/type";


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
    await switchResponse(response, async (body) => {
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