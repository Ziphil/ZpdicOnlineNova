//

import {BaseSyntheticEvent, useCallback} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/internal/type/rest";


const SCHEMA = object({
  name: string().required("nameRequired"),
  comment: string()
});
const DEFAULT_VALUE = {
  name: ""
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type AddCommissionSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useAddCommission(dictionary: Dictionary): AddCommissionSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    form.handleSubmit(async (value) => {
      const response = await request("addCommission", getQuery(dictionary, value), {useRecaptcha: true});
      await switchResponse(response, async () => {
        await invalidateResponses("fetchCommissions", (query) => query.number === dictionary.number);
        await onSubmit?.();
        dispatchSuccessToast("addCommission");
      });
    })(event);
  }, [dictionary, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(dictionary: Dictionary, value: FormValue): Omit<RequestData<"addCommission">, "recaptchaToken"> {
  const query = {
    number: dictionary.number,
    name: value.name,
    comment: value.comment
  } satisfies Omit<RequestData<"addCommission">, "recaptchaToken">;
  return query;
}