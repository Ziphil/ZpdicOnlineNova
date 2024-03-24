//

import {BaseSyntheticEvent, useCallback, useState} from "react";
import {Asserts, mixed, object} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequestFile} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";
import {listenSocket, requestSocket} from "/client/util/socket";
import {validateFileSize} from "/client/util/validation";


const SCHEMA = object({
  file: mixed<File>().required("required").test("fileSize", "tooLarge", validateFileSize(5))
});
const DEFAULT_VALUE = {
  file: undefined as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type UploadDictionarySpec = {
  form: UseFormReturn<FormValue>,
  status: UploadDictionaryStatus,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};
export type UploadDictionaryStatus = "before" | "loading" | "success" | "error";

export function useUploadDictionary(dictionary: Dictionary): UploadDictionarySpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const requestFile = useRequestFile();
  const {dispatchSuccessToast} = useToast();
  const [status, setStatus] = useState<UploadDictionaryStatus>("before");
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    await form.handleSubmit(async (value) => {
      setStatus("loading");
      await requestSocket("listenUploadDictionary", {number: dictionary.number});
      listenSocket("succeedUploadDictionary", () => setStatus("success"));
      listenSocket("failUploadDictionary", () => setStatus("error"));
      const response = await requestFile("uploadDictionary", {number: dictionary.number.toString(), file: value.file}, {useRecaptcha: true});
      await switchResponse(response, async () => {
        await onSubmit?.();
        dispatchSuccessToast("uploadDictionary");
      });
    })(event);
  }, [dictionary.number, requestFile, form, dispatchSuccessToast]);
  return {form, status, handleSubmit};
}