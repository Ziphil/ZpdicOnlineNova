//

import {BaseSyntheticEvent, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {useRequest} from "/client/hook/request";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  format: string().oneOf(["slime", "zpdic"]).required()
});
const DEFAULT_VALUE = {
  format: "slime"
} satisfies FormValue;
type FormValue = Asserts<typeof SCHEMA>;

export type QueueDownloadDictionarySpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => Promise<void>
};

export function useQueueDownloadDictionary(dictionary: Dictionary): QueueDownloadDictionarySpec {
  const form = useForm<FormValue>(SCHEMA, DEFAULT_VALUE, {});
  const request = useRequest();
  const navigate = useNavigate();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("queueDownloadDictionary", {number: dictionary.number, format: value.format});
    await switchResponse(response, async ({id}) => {
      navigate(`/dictionary/${getDictionaryIdentifier(dictionary)}/download/${id}`);
    });
  }), [dictionary, request, form, navigate]);
  return {form, handleSubmit};
}