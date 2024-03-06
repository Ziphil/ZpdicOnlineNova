//

import {BaseSyntheticEvent, useMemo} from "react";
import {Zatlin} from "zatlin";
import {UseFormReturn, useForm} from "/client-new/hook/form";


const DEFAULT_VALUE = {
  source: "",
  output: "",
  error: ""
} satisfies FormValue;
type FormValue = {
  source: string,
  output: string,
  error: string
};

export type ExecuteZatlinSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useExecuteZatlin(onSubmit?: () => unknown): ExecuteZatlinSpec {
  const form = useForm<FormValue>(DEFAULT_VALUE, {});
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    try {
      const akrantiain = Zatlin.load(value.source);
      const output = akrantiain.generate();
      form.setValue("output", output);
      form.setValue("error", "");
      await onSubmit?.();
    } catch (error) {
      if (error.name === "ZatlinError") {
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