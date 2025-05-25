//

import {BaseSyntheticEvent, useCallback} from "react";
import {Asserts, mixed, object} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {uploadFileToAws} from "/client/util/aws";
import {determineAwsErrorToastType} from "/client/util/request";
import {switchResponse} from "/client/util/response";
import {testFileSize} from "/client/util/validation";


const SCHEMA = object({
  file: mixed<File>().required("required").test(testFileSize(1, "tooLarge"))
});
const DEFAULT_VALUE = {
  file: undefined as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type AddResourceSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useAddResource(dictionary: Dictionary): AddResourceSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    await form.handleSubmit(async (value) => {
      const response = await request("fetchUploadResourcePost", {number: dictionary.number, name: value.file.name, type: value.file.type}, {useRecaptcha: true});
      await switchResponse(response, async (post) => {
        try {
          await uploadFileToAws(post, value.file);
          await invalidateResponses("fetchResources", (query) => query.number === dictionary.number);
          await onSubmit?.();
          dispatchSuccessToast("addResource");
        } catch (error) {
          dispatchErrorToast(determineAwsErrorToastType(error));
        }
      });
    })(event);
  }, [dictionary.number, request, form, dispatchSuccessToast, dispatchErrorToast]);
  return {form, handleSubmit};
}