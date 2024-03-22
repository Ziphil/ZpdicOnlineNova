//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  email: string().email("emailInvalid").required("emailRequired")
});
const DEFAULT_VALUE = {
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
    const response = await request("issueUserResetToken", value, {useRecaptcha: true});
    await switchResponse(response, async () => {
      dispatchSuccessToast("issueUserResetToken");
    });
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}