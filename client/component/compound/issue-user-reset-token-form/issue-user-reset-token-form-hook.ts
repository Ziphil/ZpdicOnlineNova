//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/type/internal";


const SCHEMA = object({
  name: string().required("nameRequired"),
  email: string().email("emailInvalid").required("emailRequired")
});
const DEFAULT_VALUE = {
  name: "",
  email: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type RegisterSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useIssueUserResetToken(): RegisterSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("issueUserResetToken", getQuery(value), {useRecaptcha: true});
    await switchResponse(response, async (body) => {
      dispatchSuccessToast("issueUserResetToken");
    });
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): Omit<RequestData<"issueUserResetToken">, "recaptchaToken"> {
  const query = {
    name: value.name || "",
    email: value.email || ""
  };
  return query;
}