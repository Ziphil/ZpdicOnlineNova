//

import {yupResolver} from "@hookform/resolvers/yup";
import {useCallback, useMemo} from "react";
import {UseFormProps as RawFormConfig, UseFormReturn as UseRawFormReturn, useForm as useRawForm} from "react-hook-form";
import {ObjectSchema} from "yup";


export function useForm<V extends {}>(defaultValue: FormDefaultValue<V>, config: FormConfig<V>): UseFormReturn<V>;
export function useForm<V extends {}>(schema: ObjectSchema<V>, defaultValue: FormDefaultValue<V>, config: FormConfig<V>): UseFormReturn<V>;
export function useForm<V extends {}>(...args: [FormDefaultValue<V>, FormConfig<V>] | [ObjectSchema<V>, FormDefaultValue<V>, FormConfig<V>]): UseFormReturn<V> {
  const [schema, defaultValue, config] = (args.length === 2) ? [undefined, ...args] : args;
  const form = useRawForm<V>({
    defaultValues: defaultValue as any,
    resolver: (schema !== undefined) ? yupResolver(schema) as any : undefined,
    ...config
  });
  const resetAll = useCallback(function (): void {
    if (typeof defaultValue !== "function") {
      form.reset(defaultValue);
    } else {
      throw new Error("not supported");
    }
  }, [defaultValue, form]);
  return useMemo(() => ({...form, resetAll}), [form, resetAll]);
}

export type UseFormReturn<V extends {}> = UseRawFormReturn<V> & {resetAll: () => void};

export type FormDefaultValue<V extends {}> = V | ((payload?: unknown) => Promise<V>);
export type FormConfig<V extends {}> = Omit<RawFormConfig<V>, "defaultValues" | "resolver">;