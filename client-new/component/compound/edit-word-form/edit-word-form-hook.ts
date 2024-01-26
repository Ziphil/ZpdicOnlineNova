//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {RelationWord} from "/client-new/component/atom/relation-word-select";
import {useForm} from "/client-new/hook/form";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary} from "/client-new/skeleton";
import type {RequestData} from "/server/controller/internal/type";


const DEFAULT_VALUE = {
  name: "",
  pronunciation: "",
  tags: [],
  equivalents: [{
    tempId: "default",
    titles: [],
    nameString: ""
  }],
  informations: [{
    tempId: "default",
    title: "",
    text: ""
  }],
  variations: [],
  relations: []
} satisfies FormValue;
type FormValue = {
  name: string,
  pronunciation: string,
  tags: Array<string>,
  equivalents: Array<{
    tempId: string,
    titles: Array<string>,
    nameString: string
  }>,
  informations: Array<{
    tempId: string,
    title: string,
    text: string
  }>,
  variations: Array<{
    tempId: string,
    title: string,
    name: string
  }>,
  relations: Array<{
    tempId: string,
    titles: Array<string>,
    word: RelationWord | null
  }>
};

export type EditWordFormSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useEditWordForm(dictionary: Dictionary): EditWordFormSpec {
  const form = useForm<FormValue>(DEFAULT_VALUE, {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("editWord", getQuery(dictionary, value));
    if (response.status === 200 && !("error" in response.data)) {
      dispatchSuccessToast("editWord");
      await invalidateResponses("searchWord", (query) => query.number === dictionary.number);
    }
  }), [dictionary, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"editWord"> {
  const query = {
    number: dictionary.number,
    word: {
      name: value.name,
      pronunciation: value.pronunciation,
      tags: value.tags,
      equivalents: value.equivalents.map((rawEquivalent) => ({
        titles: rawEquivalent.titles,
        names: rawEquivalent.nameString.split(/\s*(?:,|、|・)\s*/)
      })),
      informations: value.informations,
      variations: value.variations,
      relations: value.relations.filter((rawRelation) => rawRelation.word !== null).map((rawRelation) => ({
        titles: rawRelation.titles,
        number: rawRelation.word!.number,
        name: rawRelation.word!.name
      }))
    }
  };
  return query;
}