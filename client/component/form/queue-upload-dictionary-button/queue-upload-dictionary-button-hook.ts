//

import {BaseSyntheticEvent, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {Asserts, mixed, object} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequestFile} from "/client/hook/request";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {switchResponse} from "/client/util/response";
import {testFileSize} from "/client/util/validation";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  file: mixed<File>().required("required").test(testFileSize(5, "tooLarge"))
});
const DEFAULT_VALUE = {
  file: undefined as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type QueueUploadDictionarySpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useQueueUploadDictionary(dictionary: Dictionary): QueueUploadDictionarySpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const requestFile = useRequestFile();
  const navigate = useNavigate();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    await form.handleSubmit(async (value) => {
      const response = await requestFile("queueUploadDictionary", {number: dictionary.number.toString(), file: value.file}, {useRecaptcha: true});
      await switchResponse(response, async ({id}) => {
        await onSubmit?.();
        navigate(`/dictionary/${getDictionaryIdentifier(dictionary)}/upload/${id}`);
      });
    })(event);
  }, [dictionary, requestFile, form, navigate]);
  return {form, handleSubmit};
}
