//

import {BaseSyntheticEvent, useCallback} from "react";
import {Asserts, mixed, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/internal/type/rest";


export type UserLimitKind = RequestData<"applyIncreaseUserLimit">["kind"];

const SCHEMA = object({
  kind: mixed<UserLimitKind>().oneOf(["dictionaryCount"]).required(),
  message: string().required("messageRequired")
});
const DEFAULT_VALUE = {
  kind: "dictionaryCount",
  message: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type ApplyIncreaseUserLimitSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useApplyIncreaseUserLimit(): ApplyIncreaseUserLimitSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    form.handleSubmit(async (value) => {
      const response = await request("applyIncreaseUserLimit", getQuery(value));
      await switchResponse(response, async () => {
        await onSubmit?.();
        dispatchSuccessToast("applyIncreaseUserLimit");
      });
    })(event);
  }, [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): RequestData<"applyIncreaseUserLimit"> {
  const query = {
    kind: value.kind,
    message: value.message
  } satisfies RequestData<"applyIncreaseUserLimit">;
  return query;
}
