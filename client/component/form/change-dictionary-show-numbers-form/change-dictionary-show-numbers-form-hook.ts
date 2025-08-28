//

import {BaseSyntheticEvent, useMemo} from "react";
import {Asserts, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";


const SCHEMA = object({
  section: string().oneOf(["true", "false"]).required(),
  equivalent: string().oneOf(["true", "false"]).required()
});
type FormValue = Asserts<typeof SCHEMA>;

export type ChangeDictionaryShowNumbersSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useChangeDictionaryShowNumbers(dictionary: Dictionary): ChangeDictionaryShowNumbersSpec {
  const form = useForm<FormValue>(SCHEMA, {section: (dictionary.settings.showSectionNumber) ? "true" : "false", equivalent: (dictionary.settings.showEquivalentNumber) ? "true" : "false"}, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("changeDictionarySettings", {number: dictionary.number, settings: {showSectionNumber: value.section === "true", showEquivalentNumber: value.equivalent === "true"}});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName);
      dispatchSuccessToast("changeDictionaryShowNumbers");
    });
  }), [dictionary.number, dictionary.paramName, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}