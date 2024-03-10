//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {DetailedUser} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  screenName: string().required("required")
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeMyScreenNameSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMyScreenName(me: DetailedUser): ChangeMyScreenNameSpec {
  const form = useForm<FormValue>(SCHEMA, {screenName: me.screenName}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeUserScreenName", {screenName: value.screenName});
    await switchResponse(response, async () => {
      dispatchSuccessToast("changeMyScreenName");
    });
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}