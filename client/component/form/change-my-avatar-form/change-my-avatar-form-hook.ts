//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, mixed, object} from "yup";
import {useRefetchMe} from "/client/hook/auth";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {UserWithDetail} from "/client/skeleton";
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

export type ChangeMyAvatarSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeMyAvatar(me: UserWithDetail): ChangeMyAvatarSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const refetchMe = useRefetchMe();
  const {dispatchSuccessToast, dispatchErrorToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("fetchUploadMyAvatarPost", {}, {useRecaptcha: true});
    await switchResponse(response, async (post) => {
      try {
        await uploadFileToAws(post, value.file);
        await Promise.all([
          refetchMe(),
          invalidateResponses("fetchUser", (query) => query.name === me.name)
        ]);
        dispatchSuccessToast("changeMyAvatar");
      } catch (error) {
        dispatchErrorToast(determineAwsErrorToastType(error));
      }
    });
  }), [me.name, request, refetchMe, form, dispatchSuccessToast, dispatchErrorToast]);
  return {form, handleSubmit};
}