//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {useLoginRequest} from "/client-new/hook/auth";
import {useForm} from "/client-new/hook/form";
import {useToast} from "/client-new/hook/toast";
import type {RequestData} from "/server/controller/internal/type";


const schema = object({
  name: string().required("nameRequired"),
  password: string().required("passwordRequired")
});
const defaultValue = {
  name: "",
  password: ""
} satisfies FormValue;
type FormValue = Asserts<typeof schema>;

export type LoginFormSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useLoginForm(): LoginFormSpec {
  const form = useForm<FormValue>(schema, defaultValue, {});
  const login = useLoginRequest();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const navigate = useNavigate();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await login(getQuery(value));
    if (response.status === 200 && !("error" in response.data)) {
      const body = response.data;
      dispatchSuccessToast("login");
      navigate(`/user/${body.user.name}`);
    } else {
      dispatchErrorToast("loginFailed");
    }
  }), [login, navigate, form, dispatchSuccessToast, dispatchErrorToast]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): RequestData<"login"> {
  const query = {
    name: value.name || "",
    password: value.password || ""
  };
  return query;
}