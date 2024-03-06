//

import {yupResolver} from "@hookform/resolvers/yup";
import {useCallback, useMemo} from "react";
import {UseFormProps as RawFormConfig, UseFormReturn as UseRawFormReturn, useForm as useRawForm} from "react-hook-form";
import {ObjectSchema} from "yup";


export function useForm<V extends {}>(defaultValue: V, config: FormConfig<V>): UseFormReturn<V>;
export function useForm<V extends {}>(schema: ObjectSchema<V>, defaultValue: V, config: FormConfig<V>): UseFormReturn<V>;
export function useForm<V extends {}>(...args: [V, FormConfig<V>] | [ObjectSchema<V>, V, FormConfig<V>]): UseFormReturn<V> {
  const [schema, defaultValue, config] = (args.length === 2) ? [undefined, ...args] : args;
  const form = useRawForm<V>({
    defaultValues: defaultValue as any,
    resolver: (schema !== undefined) ? yupResolver(schema) as any : undefined,
    ...config
  });
  const resetAll = useCallback(function (): void {
    form.reset(defaultValue);
  }, [defaultValue, form]);
  return useMemo(() => ({...form, resetAll}), [form, resetAll]);
}

export type UseFormReturn<V extends {}> = UseRawFormReturn<V> & {resetAll: () => void};
export type FormConfig<V extends {}> = Omit<RawFormConfig<V>, "defaultValues" | "resolver">;