//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {useForm} from "/client-new/hook/form";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import type {RequestData} from "/server/controller/internal/type";


const defaultValue = {
  name: "",
  pronunciation: "",
  tags: [],
  equivalents: []
} satisfies FormValue;
type FormValue = {
  name: string,
  pronunciation: string,
  tags: Array<string>,
  equivalents: Array<{
    tempId: string,
    titles: Array<string>,
    nameString: string
  }>
};

export type EditWordFormSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useEditWordForm(): EditWordFormSpec {
  const form = useForm<FormValue>(defaultValue, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = request as any;
    if (response.status === 200 && !("error" in response.data)) {
      dispatchSuccessToast("editWord");
    }
  }), [request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(value: FormValue): RequestData<"editWord"> {
  const query = {} as any;
  return query;
}