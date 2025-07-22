//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {UserWithDetail} from "/server/internal/skeleton";


const SCHEMA = object({
  currentPassword: string().required("currentRequired"),
  newPassword: string().min(6, "tooShort").max(50, "tooLong").required("newRequired")
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeMyPasswordSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMyPassword(me: UserWithDetail): ChangeMyPasswordSpec {
  const form = useForm<FormValue>(SCHEMA, {currentPassword: "", newPassword: ""}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeMyPassword", {password: value.newPassword});
    await switchResponse(response, async () => {
      dispatchSuccessToast("changeMyPassword");
    });
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}