//

import {BaseSyntheticEvent, useCallback} from "react";
import {Asserts, mixed, object} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, User} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


const SCHEMA = object({
  user: mixed<User>().required("required")
});
const DEFAULT_VALUE = {
  user: undefined as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type AddEditInvitationSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useAddEditInvitation(dictionary: Dictionary): AddEditInvitationSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    await form.handleSubmit(async (value) => {
      const response = await request("addInvitation", {number: dictionary.number, type: "edit", userName: value.user.name});
      await switchResponse(response, async (body) => {
        await onSubmit?.();
        dispatchSuccessToast("addInvitation.edit");
      });
    })(event);
  }, [dictionary.number, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}