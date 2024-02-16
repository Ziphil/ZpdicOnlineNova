//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {Asserts, mixed, object} from "yup";
import {useForm} from "/client-new/hook/form";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary, User} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


const SCHEMA = object({
  user: mixed<User>().required("required")
});
const DEFAULT_VALUE = {
  user: null as any
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type AddTransferInvitationSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => Promise<void>
};

export function useAddTransferInvitation(dictionary: Dictionary): AddTransferInvitationSpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("addInvitation", {number: dictionary.number, type: "transfer", userName: value.user.name});
    await switchResponse(response, async (body) => {
      dispatchSuccessToast("addTransferInvitation");
    });
  }), [dictionary.number, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}