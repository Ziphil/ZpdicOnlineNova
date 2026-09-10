//

import {BaseSyntheticEvent, useCallback} from "react";
import {Asserts, mixed, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";
import type {RequestData} from "/server/internal/type/rest";


export type DictionaryLimitKind = RequestData<"applyIncreaseDictionaryLimit">["kind"];

const SCHEMA = object({
  kind: mixed<DictionaryLimitKind>().oneOf(["wordCount", "exampleCount", "articleCount"]).required(),
  message: string().required("messageRequired")
});
const DEFAULT_VALUE = {
  kind: "wordCount",
  message: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type ApplyIncreaseDictionaryLimitSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useApplyIncreaseDictionaryLimit(dictionary: Dictionary): ApplyIncreaseDictionaryLimitSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    form.handleSubmit(async (value) => {
      const response = await request("applyIncreaseDictionaryLimit", getQuery(dictionary, value));
      await switchResponse(response, async () => {
        await onSubmit?.();
        dispatchSuccessToast("applyIncreaseDictionaryLimit");
      });
    })(event);
  }, [dictionary, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"applyIncreaseDictionaryLimit"> {
  const query = {
    number: dictionary.number,
    kind: value.kind,
    message: value.message
  } satisfies RequestData<"applyIncreaseDictionaryLimit">;
  return query;
}
