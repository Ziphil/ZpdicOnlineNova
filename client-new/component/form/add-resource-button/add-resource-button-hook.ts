//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {Asserts, mixed, object} from "yup";
import {useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary} from "/client-new/skeleton";
import {uploadFileToAws} from "/client-new/util/aws";
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

export function useAddResource(dictionary: Dictionary): AddResourceSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("fetchUploadResourcePost", {number: dictionary.number, name: value.file.name, type: value.file.type}, {useRecaptcha: true});
    await switchResponse(response, async (data) => {
      const post = data;
      try {
        await uploadFileToAws(post, value.file);
        await invalidateResponses("fetchResources", (data) => data.number === dictionary.number);
        dispatchSuccessToast("addResource");
      } catch (error) {
        if (error.name === "AwsError") {
          const code = error.data["Code"]["_text"];
          const message = error.data["Message"]["_text"];
          if (code === "EntityTooLarge") {
            dispatchErrorToast("resourceSizeTooLarge");
          } else if (code === "AccessDenied" && message.includes("Policy Condition failed") && message.includes("$Content-Type")) {
            dispatchErrorToast("unsupportedResourceType");
          } else {
            dispatchErrorToast("awsError");
          }
        } else {
          dispatchErrorToast("awsError");
        }
      }
    });
  }), [dictionary.number, request, form, dispatchSuccessToast, dispatchErrorToast]);
  return {form, handleSubmit};
}