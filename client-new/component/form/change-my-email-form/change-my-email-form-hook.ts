//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client-new/hook/form";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {DetailedUser} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


const SCHEMA = object({
  email: string().email("invalid").required("required")
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeMyEmailSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMyEmail(me: DetailedUser): ChangeMyEmailSpec {
  const form = useForm<FormValue>(SCHEMA, {email: me.email}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeUserEmail", {email: value.email});
    await switchResponse(response, async () => {
      dispatchSuccessToast("changeMyEmail");
    });
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}