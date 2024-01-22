//

import {yupResolver} from "@hookform/resolvers/yup";
import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {useLoginRequest} from "/client-new/hook/auth";
import {useToast} from "/client-new/hook/toast";
import {RequestData} from "/server/controller/internal/type";


const schema = object({
  name: string().required("nameRequired"),
  password: string().required("passwordRequired")
});
const DEFAULT_FORM_VALUE = {
  name: "",
  password: ""
};
type FormValue = Asserts<typeof schema>;

export type LoginFormSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useLogin(): LoginFormSpec {
  const form = useForm<FormValue>({
    defaultValues: DEFAULT_FORM_VALUE,
    resolver: yupResolver(schema)
  });
  const login = useLoginRequest();
  const {dispatchErrorToast} = useToast();
  const navigate = useNavigate();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await login(getQuery(value));
    if (response.status === 200 && !("error" in response.data)) {
      const user = response.data.user;
      navigate(`/user/${user.name}`);
    } else {
      dispatchErrorToast("loginFailed");
    }
  }), [login, navigate, form, dispatchErrorToast]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): RequestData<"login"> {
  const query = {
    name: value.name || "",
    password: value.password || ""
  };
  return query;
}