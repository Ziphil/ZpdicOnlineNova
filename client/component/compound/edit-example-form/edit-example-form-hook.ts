//

import {BaseSyntheticEvent, useMemo} from "react";
import {RelationWord} from "/client/component/atom/relation-word-select";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, EditableExample, Example} from "/client/skeleton";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/type/rest/internal";


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
export type EditExampleFormValue = FormValue;
export type EditExampleInitialData = {type: "example", example: Example} | {type: "form", value: EditExampleFormValue};

export function useEditExample(dictionary: Dictionary, initialData: EditExampleInitialData | null, onSubmit?: (example: EditableExample) => unknown): EditExampleSpec {
  const form = useForm<FormValue>((initialData !== null) ? getFormValue(initialData) : DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const adding = value.number === null;
    const query = getQuery(dictionary, value);
    const response = await request("editExample", query);
    await switchResponse(response, async (example) => {
      form.setValue("number", example.number);
      await Promise.all([
        invalidateResponses("fetchExamples", (query) => query.number === dictionary.number),
        invalidateResponses("searchWord", (query) => query.number === dictionary.number),
        invalidateResponses("fetchDictionarySizes", (query) => query.number === dictionary.number)
      ]);
      await onSubmit?.(query.example);
      dispatchSuccessToast((adding) ? "addExample" : "changeExample");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(initialData: EditExampleInitialData): FormValue {
  if (initialData.type === "example") {
    const example = initialData.example;
    const value = {
      number: example.number,
      sentence: example.sentence,
      translation: example.translation,
      words: example.words.map((word) => ({
        number: word.number,
        name: word.name
      }))
    } satisfies FormValue;
    return value;
  } else {
    return initialData.value;
  }
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