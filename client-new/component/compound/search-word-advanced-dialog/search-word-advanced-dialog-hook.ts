//

import {BaseSyntheticEvent, useCallback} from "react";
import {UseFormReturn} from "react-hook-form";
import {AsyncOrSync} from "ts-essentials";
import {useForm} from "/client-new/hook/form";
import {AdvancedWordMode, AdvancedWordParameter, WordType} from "/client-new/skeleton";


const DEFAULT_VALUE = {
  elements: [{
    text: "",
    title: "",
    mode: "name",
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
      const parameter = getQuery(value);
      await onSubmit?.(parameter);
    })(event);
  }, [form]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): AdvancedWordParameter {
  return value;
}