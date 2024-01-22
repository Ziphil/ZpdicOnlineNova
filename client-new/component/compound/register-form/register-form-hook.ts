//

import {yupResolver} from "@hookform/resolvers/yup";
import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Asserts, boolean, object, string} from "yup";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import type {RequestData} from "/server/controller/internal/type";


const schema = object({
  name: string().required("nameRequired"),
  email: string().email("emailInvalid").required("emailRequired"),
  password: string().min(6, "passwordTooShort").max(50, "passwordTooLong").required("passwordRequired"),
  agree: boolean().oneOf([true], "agreeRequired")
});
const DEFAULT_FORM_VALUE = {
  name: "",
  email: "",
  password: "",
  agree: false
} satisfies FormValue;
type FormValue = Asserts<typeof schema>;

export type RegisterFormSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useRegisterForm(): RegisterFormSpec {
  const form = useForm<FormValue>({
    defaultValues: DEFAULT_FORM_VALUE,
    resolver: yupResolver(schema)
  });
  const request = useRequest();
  const {dispatchErrorToast} = useToast();
  const navigate = useNavigate();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("registerUser", getQuery(value), {useRecaptcha: true});
    if (response.status === 200 && !("error" in response.data)) {
      const body = response.data;
      navigate(`/user/${body.name}`);
    }
  }), [request, navigate, form]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): Omit<RequestData<"registerUser">, "recaptchaToken"> {
  const query = {
    name: value.name || "",
    email: value.email || "",
    password: value.password || ""
  };
  return query;
}