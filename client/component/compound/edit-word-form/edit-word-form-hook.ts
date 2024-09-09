//

import {BaseSyntheticEvent, useMemo} from "react";
import {noop} from "ts-essentials";
import {RelationWord} from "/client/component/atom/relation-word-select";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, EditableWord, Relation, Word} from "/client/skeleton";
import {escapeRegexp} from "/client/util/misc";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/type/rest/internal";


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
    word: Required<RelationWord> | null,
    mutual: boolean
  }>
};

export type EditWordSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};
export type EditWordFormValue = FormValue;
export type EditWordInitialData = {type: "word", word: Word | EditableWord, forceAdd?: boolean} | {type: "form", value: EditWordFormValue, forceAdd?: boolean};
export const getEditWordFormValue = getFormValue;

export function useEditWord(dictionary: Dictionary, initialData: EditWordInitialData | null, onSubmit?: (word: EditableWord) => unknown): EditWordSpec {
  const form = useForm<FormValue>(getFormValue(initialData), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const adding = value.number === null;
    const response = await request("editWord", getQuery(dictionary, value));
    await switchResponse(response, async (word) => {
      form.setValue("number", word.number);
      await request("addRelations", getQueryForRelations(dictionary, word, value)).catch(noop);
      await Promise.all([
        invalidateResponses("searchWords", (query) => query.number === dictionary.number),
        invalidateResponses("fetchDictionarySizes", (query) => query.number === dictionary.number)
      ]);
      await onSubmit?.(word);
      dispatchSuccessToast((adding) ? "addWord" : "changeWord");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(initialData: EditWordInitialData | null): FormValue {
  if (initialData !== null) {
    if (initialData.type === "word") {
      const word = initialData.word;
      const value = {
        number: (initialData.forceAdd) ? null : word.number ?? null,
        name: word.name,
        pronunciation: word.pronunciation || "",
        tags: word.tags,
        equivalents: word.equivalents.map((equivalent) => ({
          titles: equivalent.titles,
          nameString: equivalent.nameString
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
          },
          mutual: false
        }))
      } satisfies FormValue;
      return value;
    } else {
      const value = {
        ...initialData.value,
        number: (initialData.forceAdd) ? null : initialData.value.number
      } satisfies FormValue;
      return value;
    }
  } else {
    return DEFAULT_VALUE;
  }
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
        names: createEquivalentNames(dictionary, rawEquivalent),
        nameString: rawEquivalent.nameString,
        ignoredPattern: dictionary.settings.ignoredEquivalentPattern
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

function getQueryForRelations(dictionary: Dictionary, editedWord: Word, value: FormValue): RequestData<"addRelations"> {
  const number = dictionary.number;
  const specs = value.relations.filter((relation) => relation.word !== null && relation.mutual).map((relation) => {
    const inverseRelation = {
      ...Relation.EMPTY,
      number: editedWord.number,
      name: editedWord.name,
      titles: relation.titles
    };
    return {wordNumber: relation.word!.number, relation: inverseRelation};
  });
  const query = {number, specs};
  return query;
}

function createEquivalentNames(dictionary: Dictionary, rawEquivalent: FormValue["equivalents"][0]): Array<string> {
  const punctuationRegexp = new RegExp(`[${escapeRegexp(dictionary.settings.punctuations.join(""))}]`);
  const ignoreRegexp = new RegExp(dictionary.settings.ignoredEquivalentPattern || "", "g");
  const ignoredNameString = (dictionary.settings.ignoredEquivalentPattern) ? rawEquivalent.nameString.replace(ignoreRegexp, "") : rawEquivalent.nameString;
  const names = ignoredNameString.split(punctuationRegexp).map((name) => name.trim()).filter((name) => name);
  return names;
}