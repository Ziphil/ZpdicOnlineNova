//

import {BaseSyntheticEvent, useMemo} from "react";
import {Zatlin} from "zatlin";
import {UseFormReturn, useForm} from "/client/hook/form";


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
      const zatlin = Zatlin.load(value.source);
      const output = zatlin.generate();
      form.setValue("output", output);
      form.setValue("error", "");
      await onSubmit?.();
    } catch (error) {
      console.error(error.type);
      if (error.name === "ZatlinError") {
        const errorMessage = error.message.trim();
        form.setValue("output", "");
        form.setValue("error", errorMessage);
      } else if (error.type === "ParsimmonError") {
        form.setValue("output", "");
        form.setValue("error", `Parse error:\n${error.message}`);
      } else {
        form.setValue("output", "");
        form.setValue("error", `Unexpected error:\n${error.message}`);
      }
    }
  }), [onSubmit, form]);
  return {form, handleSubmit};
}