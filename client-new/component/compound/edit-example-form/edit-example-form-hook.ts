//

import {BaseSyntheticEvent, useMemo} from "react";
import {RelationWord} from "/client-new/component/atom/relation-word-select";
import {UseFormReturn, useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary, EditableExample, Example} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";
import type {RequestData} from "/server/controller/internal/type";


const DEFAULT_VALUE = {
  number: null,
  sentence: "",
  translation: "",
  words: []
} satisfies FormValue;
type FormValue = {
  number: number | null,
  sentence: string,
  translation: string,
  words: Array<RelationWord | null>
};

export type EditExampleSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useEditExample(dictionary: Dictionary, example: Example | null, onSubmit?: (example: EditableExample) => unknown): EditExampleSpec {
  const form = useForm<FormValue>((example !== null) ? getFormValue(example) : DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const adding = value.number === null;
    const query = getQuery(dictionary, value);
    const response = await request("editExample", query);
    await switchResponse(response, async (body) => {
      form.setValue("number", body.number);
      await invalidateResponses("fetchExamples", (query) => query.number === dictionary.number);
      await onSubmit?.(query.example);
      dispatchSuccessToast((adding) ? "addExample" : "changeExample");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(example: Example): FormValue {
  const value = {
    number: example.number,
    sentence: example.sentence,
    translation: example.translation,
    words: example.words.map((word) => ({
      number: word.number,
      name: word.name ?? "?"
    }))
  } satisfies FormValue;
  return value;
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"editExample"> {
  const query = {
    number: dictionary.number,
    example: {
      number: value.number ?? undefined,
      sentence: value.sentence,
      translation: value.translation,
      words: value.words.filter((rawWord) => rawWord !== null).map((rawWord) => ({
        number: rawWord!.number
      }))
    }
  } satisfies RequestData<"editExample">;
  return query;
}