//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {RelationWord} from "/client-new/component/atom/relation-word-select";
import {useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary, Word} from "/client-new/skeleton";
import type {RequestData} from "/server/controller/internal/type";


const DEFAULT_VALUE = {
  number: null,
  name: "",
  pronunciation: "",
  tags: [],
  equivalents: [{
    titles: [],
    nameString: ""
  }],
  informations: [{
    title: "",
    text: ""
  }],
  variations: [],
  relations: []
} satisfies FormValue;
type FormValue = {
  number: number | null,
  name: string,
  pronunciation: string,
  tags: Array<string>,
  equivalents: Array<{
    titles: Array<string>,
    nameString: string
  }>,
  informations: Array<{
    title: string,
    text: string
  }>,
  variations: Array<{
    title: string,
    name: string
  }>,
  relations: Array<{
    titles: Array<string>,
    word: RelationWord | null
  }>
};

export type EditWordFormSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useEditWordForm(dictionary: Dictionary, word: Word | null): EditWordFormSpec {
  const form = useForm<FormValue>((word !== null) ? getFormValue(word) : DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("editWord", getQuery(dictionary, value));
    if (response.status === 200 && !("error" in response.data)) {
      const body = response.data;
      form.setValue("number", body.number);
      dispatchSuccessToast("editWord");
      await invalidateResponses("searchWord", (query) => query.number === dictionary.number);
    }
  }), [dictionary, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(word: Word): FormValue {
  const value = {
    number: word.number,
    name: word.name,
    pronunciation: word.pronunciation || "",
    tags: word.tags,
    equivalents: word.equivalents.map((equivalent) => ({
      titles: equivalent.titles,
      nameString: equivalent.names.join(", ")
    })),
    informations: word.informations.map((information) => ({
      title: information.title,
      text: information.text
    })),
    variations: word.variations.map((variation) => ({
      title: variation.title,
      name: variation.name
    })),
    relations: word.relations.map((relation) => ({
      titles: relation.titles,
      word: {
        number: relation.number,
        name: relation.name
      }
    }))
  } satisfies FormValue;
  return value;
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"editWord"> {
  const query = {
    number: dictionary.number,
    word: {
      number: value.number ?? undefined,
      name: value.name,
      pronunciation: value.pronunciation,
      tags: value.tags,
      equivalents: value.equivalents.map((rawEquivalent) => ({
        titles: rawEquivalent.titles,
        names: rawEquivalent.nameString.split(/\s*(?:,|、|。|・)\s*/)
      })),
      informations: value.informations,
      variations: value.variations,
      relations: value.relations.filter((rawRelation) => rawRelation.word !== null).map((rawRelation) => ({
        titles: rawRelation.titles,
        number: rawRelation.word!.number,
        name: rawRelation.word!.name
      }))
    }
  } satisfies RequestData<"editWord">;
  return query;
}