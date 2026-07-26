//

import {useCallback, useEffect, useRef} from "react";
import {FieldValues} from "react-hook-form";
import {useDebouncedCallback} from "zographia";
import {UseFormReturn, useForm} from "/client/hook/form";


export function useSearchForm<P, V extends FieldValues>({
  parameter,
  debouncedNames,
  toFormValue,
  fromFormValue,
  onCommit,
  onChange
}: SearchFormOptions<P, V>): SearchFormSpec<V> {
  const form = useForm<V>(toFormValue(parameter), {});
  const {watch, getValues, reset} = form;
  const lastCommittedParameterRef = useRef(parameter);
  const debouncedNamesRef = useRef(debouncedNames);
  const onChangeRef = useRef(onChange);
  const formRef = useRef(form);
  debouncedNamesRef.current = debouncedNames;
  onChangeRef.current = onChange;
  formRef.current = form;
  const runCommit = useCallback(function (): void {
    const nextParameter = fromFormValue(getValues());
    lastCommittedParameterRef.current = nextParameter;
    onCommit(nextParameter);
  }, [fromFormValue, getValues, onCommit]);
  const commitShortly = useDebouncedCallback(runCommit, 500, [runCommit]);
  const commit = useCallback(function (): void {
    commitShortly.cancel();
    runCommit();
  }, [commitShortly, runCommit]);
  useEffect(() => {
    const subscription = watch((value, {name, type}) => {
      if (type === "change") {
        onChangeRef.current?.(formRef.current, name);
        if (name !== undefined && debouncedNamesRef.current.includes(name)) {
          commitShortly();
        } else {
          commit();
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, commit, commitShortly]);
  useEffect(() => {
    const nextValue = toFormValue(parameter);
    const echo = JSON.stringify(nextValue) === JSON.stringify(toFormValue(lastCommittedParameterRef.current));
    if (!echo) {
      lastCommittedParameterRef.current = parameter;
      reset(nextValue);
    }
  }, [parameter, toFormValue, reset]);
  return {form, commit};
}

export type SearchFormOptions<P, V extends FieldValues> = {
  parameter: P,
  debouncedNames: ReadonlyArray<string>,
  toFormValue: (parameter: P) => V,
  fromFormValue: (value: V) => P,
  onCommit: (parameter: P) => void,
  onChange?: (form: UseFormReturn<V>, name: string | undefined) => void
};

export type SearchFormSpec<V extends FieldValues> = {
  form: UseFormReturn<V>,
  commit: () => void
};
