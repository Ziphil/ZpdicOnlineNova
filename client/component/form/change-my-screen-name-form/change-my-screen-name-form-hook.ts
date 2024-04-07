//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {useRefetchMe} from "/client/hook/auth";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {UserWithDetail} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  screenName: string().required("required")
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeMyScreenNameSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMyScreenName(me: UserWithDetail): ChangeMyScreenNameSpec {
  const form = useForm<FormValue>(SCHEMA, {screenName: me.screenName}, {});
  const request = useRequest();
  const refetchMe = useRefetchMe();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeMyScreenName", {screenName: value.screenName});
    await switchResponse(response, async () => {
      await Promise.all([
        refetchMe(),
        invalidateResponses("fetchUser", (query) => query.name === me.name)
      ]);
      dispatchSuccessToast("changeMyScreenName");
    });
  }), [me.name, request, refetchMe, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}