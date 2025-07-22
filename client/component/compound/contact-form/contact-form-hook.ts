//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, boolean, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {UserWithDetail} from "/server/internal/skeleton";
import type {RequestData} from "/server/internal/type/rest";


const SCHEMA = object({
  name: string(),
  email: string().email("emailInvalid"),
  subject: string(),
  text: string().required("textRequired"),
  agree: boolean().oneOf([true], "agreeRequired")
});
const DEFAULT_VALUE = {
  name: "",
  email: "",
  subject: "",
  text: "",
  agree: false
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type ContactSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useContact(me: UserWithDetail | null): ContactSpec {
  const form = useForm<FormValue>(SCHEMA, getDefaultFormValue(me), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("contact", getQuery(value), {useRecaptcha: true});
    await switchResponse(response, async () => {
      form.reset({
        subject: "",
        text: "",
        agree: false
      });
      dispatchSuccessToast("contact");
    });
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getDefaultFormValue(me: UserWithDetail | null): FormValue {
  if (me !== null) {
    return {...DEFAULT_VALUE, name: me.screenName, email: me.email};
  } else {
    return DEFAULT_VALUE;
  }
}

function getQuery(value: FormValue): Omit<RequestData<"contact">, "recaptchaToken"> {
  const query = {
    name: value.name || "",
    email: value.email || "",
    subject: value.subject || "",
    text: value.text || ""
  };
  return query;
}