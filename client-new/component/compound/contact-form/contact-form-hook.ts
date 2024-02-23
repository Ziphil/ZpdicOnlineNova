//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {Asserts, boolean, object, string} from "yup";
import {useForm} from "/client-new/hook/form";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {DetailedUser} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";
import {RequestData} from "/server/controller/internal/type";


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

export function useContact(me: DetailedUser | null): ContactSpec {
  const form = useForm<FormValue>(SCHEMA, getDefaultFormValue(me), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("contact", getQuery(value), {useRecaptcha: true});
    await switchResponse(response, async (body) => {
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

function getDefaultFormValue(me: DetailedUser | null): FormValue {
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