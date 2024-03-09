//

import {Akrantiain} from "akrantiain";
import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn, useForm} from "/client-new/hook/form";


const DEFAULT_VALUE = {
  source: "",
  input: "",
  output: "",
  error: ""
} satisfies FormValue;
type FormValue = {
  source: string,
  input: string,
  output: string,
  error: string
};

export type ExecuteAkrantiainSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useExecuteAkrantiain(onSubmit?: () => unknown): ExecuteAkrantiainSpec {
  const form = useForm<FormValue>(DEFAULT_VALUE, {});
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    try {
      const akrantiain = Akrantiain.load(value.source);
      const output = akrantiain.convert(value.input);
      form.setValue("output", output);
      form.setValue("error", "");
      await onSubmit?.();
    } catch (error) {
      if (error.name === "AkrantiainError") {
        const errorMessage = error.message.trim();
        form.setValue("output", "");
        form.setValue("error", errorMessage);
      } else {
        form.setValue("output", "");
        form.setValue("error", "An unexpected error occurred");
      }
    }
  }), [onSubmit, form]);
  return {form, handleSubmit};
}