//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {Asserts, mixed, object} from "yup";
import {useForm} from "/client-new/hook/form";
import {useRequestFile} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


const SCHEMA = object({
  file: mixed<File>().required("required")
});
const DEFAULT_VALUE = {
  file: null as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type AddResourceSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => Promise<void>
};

export function useUploadDictionary(dictionary: Dictionary): AddResourceSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const requestFile = useRequestFile();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await requestFile("uploadDictionary", {number: dictionary.number.toString(), file: value.file}, {useRecaptcha: true});
    await switchResponse(response, async (data) => {
      dispatchSuccessToast("uploadDictionary");
    });
  }), [dictionary.number, requestFile, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}