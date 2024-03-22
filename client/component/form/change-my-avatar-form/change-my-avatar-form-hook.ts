//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, mixed, object} from "yup";
import {useRefetchMe} from "/client/hook/auth";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {DetailedUser} from "/client/skeleton";
import {uploadFileToAws} from "/client/util/aws";
import {switchResponse} from "/client/util/response";
import {validateFileSize} from "/client/util/validation";


const SCHEMA = object({
  file: mixed<File>().required("required").test("fileSize", "tooLarge", validateFileSize(1))
});
const DEFAULT_VALUE = {
  file: undefined as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeMyAvatarSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMyAvatar(me: DetailedUser): ChangeMyAvatarSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const refetchMe = useRefetchMe();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("fetchUploadMyAvatarPost", {}, {useRecaptcha: true});
    await switchResponse(response, async (data) => {
      const post = data;
      try {
        await uploadFileToAws(post, value.file);
        await Promise.all([
          refetchMe(),
          invalidateResponses("fetchUser", (data) => data.name === me.name)
        ]);
        dispatchSuccessToast("changeMyAvatar");
      } catch (error) {
        const type = deternimeErrorToastType(error);
        dispatchErrorToast(type);
      }
    });
  }), [me.name, request, refetchMe, form, dispatchSuccessToast, dispatchErrorToast]);
  return {form, handleSubmit};
}

function deternimeErrorToastType(error: any): string {
  if (error.name === "AwsError") {
    const code = error.data["Code"]["_text"];
    const message = error.data["Message"]["_text"];
    if (code === "EntityTooLarge") {
      return "resourceSizeTooLarge";
    } else if (code === "AccessDenied" && message.includes("Policy Condition failed") && message.includes("$Content-Type")) {
      return "unsupportedResourceType";
    } else {
      return "awsError";
    }
  } else {
    return "unexpected";
  }
}