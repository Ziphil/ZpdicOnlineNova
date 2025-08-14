//

import {BaseSyntheticEvent, useCallback} from "react";
import {AsyncOrSync} from "ts-essentials";
import {UseFormReturn, useForm} from "/client/hook/form";
import {AdvancedWordMode, AdvancedWordParameter, WordType} from "/server/internal/skeleton";


const DEFAULT_VALUE = {
  elements: [{
    text: "",
    title: "",
    mode: "spelling",
    type: "exact"
  }]
} satisfies FormValue;
type FormValue = {
  elements: Array<{
    text: string,
    title: string,
    mode: AdvancedWordMode,
    type: WordType
  }>
};

export type SearchWordAdvancedSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: (parameter: AdvancedWordParameter) => AsyncOrSync<void>) => Promise<void>
};

export function useSearchWordAdvanced(): SearchWordAdvancedSpec {
  const form = useForm<FormValue>(DEFAULT_VALUE, {});
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: (parameter: AdvancedWordParameter) => AsyncOrSync<void>): Promise<void> {
    await form.handleSubmit(async (value) => {
      const parameter = getParameter(value);
      await onSubmit?.(parameter);
    })(event);
  }, [form]);
  return {form, handleSubmit};
}

function getParameter(value: FormValue): AdvancedWordParameter {
  const query = {
    kind: "advanced",
    ...value
  } satisfies AdvancedWordParameter;
  return query;
}