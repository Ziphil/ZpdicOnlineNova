//

import {BaseSyntheticEvent, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {useLoginRequest} from "/client/hook/auth";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/type/rest/internal";


const SCHEMA = object({
  name: string().required("nameRequired"),
  password: string().required("passwordRequired")
});
const DEFAULT_VALUE = {
  name: "",
  password: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type LoginSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useLogin(): LoginSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const login = useLoginRequest();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const navigate = useNavigate();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await login(getQuery(value), {ignoreError: true});
    await switchResponse(response, async ({user}) => {
      navigate(`/user/${user.name}`);
      dispatchSuccessToast("login");
    }, async () => {
      dispatchErrorToast("loginFailed");
    });
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