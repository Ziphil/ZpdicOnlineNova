//

import {BaseSyntheticEvent, useMemo} from "react";
import {RelationWord} from "/client/component/atom/relation-word-select";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary, EditableExample, Example, ExampleOffer, LinkedExampleOffer} from "/server/internal/skeleton";
import type {RequestData} from "/server/internal/type/rest";


const DEFAULT_VALUE = {
  number: null,
  sentence: "",
  translation: "",
  supplement: "",
  tags: [],
  words: [],
  offer: null
} satisfies FormValue;
type FormValue = {
  number: number | null,
  sentence: string,
  translation: string,
  supplement: string,
  tags: Array<string>,
  words: Array<RelationWord | null>,
  offer: LinkedExampleOffer | null
};

export type EditExampleSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};
export type EditExampleFormValue = FormValue;
export type EditExampleInitialData = {type: "example", example: Example} | {type: "offer", offer: ExampleOffer} | {type: "form", value: EditExampleFormValue};
export const getEditExampleFormValue = getFormValue;

export function useEditExample(dictionary: Dictionary, initialData: EditExampleInitialData | null, onSubmit?: (example: EditableExample) => unknown): EditExampleSpec {
  const form = useForm<FormValue>(getFormValue(initialData), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const adding = value.number === null;
    const query = getQuery(dictionary, value);
    const response = await request("editExample", query);
    await switchResponse(response, async (example) => {
      form.setValue("number", example.number);
      await Promise.all([
        invalidateResponses("searchWords", (query) => query.number === dictionary.number),
        invalidateResponses("searchExamples", (query) => query.number === dictionary.number),
        invalidateResponses("fetchExamplesByOffer", (query) => query.number === dictionary.number),
        invalidateResponses("fetchDictionarySizes", (query) => query.number === dictionary.number)
      ]);
      await onSubmit?.(query.example);
      dispatchSuccessToast((adding) ? "addExample" : "changeExample");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(initialData: EditExampleInitialData | null): FormValue {
  if (initialData !== null) {
    if (initialData.type === "example") {
      const example = initialData.example;
      const value = {
        number: example.number,
        sentence: example.sentence,
        translation: example.translation,
        supplement: example.supplement ?? "",
        tags: example.tags ?? [],
        words: example.words.map((word) => ({
          number: word.number,
          name: word.name
        })),
        offer: example.offer
      } satisfies FormValue;
      return value;
    } else if (initialData.type === "offer") {
      const offer = initialData.offer;
      const value = {
        number: null,
        sentence: "",
        translation: offer.translation,
        supplement: "",
        tags: [],
        words: [],
        offer: {catalog: offer.catalog, number: offer.number}
      } satisfies FormValue;
      return value;
    } else {
      return initialData.value;
    }
  } else {
    return DEFAULT_VALUE;
  }
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"editExample"> {
  const query = {
    number: dictionary.number,
    example: {
      number: value.number ?? null,
      sentence: value.sentence,
      translation: (value.offer !== null) ? "" : value.translation,
      supplement: value.supplement,
      tags: value.tags,
      words: value.words.filter((rawWord) => rawWord !== null).map((rawWord) => ({
        number: rawWord!.number
      })),
      offer: (value.offer !== null) ? value.offer : null
    }
  } satisfies RequestData<"editExample">;
  return query;
}