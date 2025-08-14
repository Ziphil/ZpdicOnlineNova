//

import {RE2JS as Re2} from "re2js";
import {BaseSyntheticEvent, useMemo} from "react";
import {noop} from "ts-essentials";
import {RelationWord} from "/client/component/atom/relation-word-select";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {escapeRegexp} from "/client/util/misc";
import {switchResponse} from "/client/util/response";
import {Dictionary, EditableWord, Relation, TemplateWord, Word} from "/server/internal/skeleton";
import type {RequestData} from "/server/internal/type/rest";


const DEFAULT_VALUE = {
  number: null,
  spelling: "",
  pronunciation: "",
  tags: [],
  sections: [{
    equivalents: [{
      titles: [],
      termString: "",
      hidden: false
    }],
    informations: [],
    phrases: [],
    variations: [],
    relations: []
  }]
} satisfies FormValue;
type FormValue = {
  number: number | null,
  spelling: string,
  pronunciation: string,
  tags: Array<string>,
  sections: Array<{
    equivalents: Array<{
      titles: Array<string>,
      termString: string,
      hidden: boolean
    }>,
    informations: Array<{
      title: string,
      text: string,
      hidden: boolean
    }>,
    phrases: Array<{
      titles: Array<string>,
      expression: string,
      termString: string
    }>,
    variations: Array<{
      title: string,
      spelling: string,
      pronunciation: string
    }>,
    relations: Array<{
      titles: Array<string>,
      word: (RelationWord & {spelling: string}) | null,
      mutual: boolean
    }>
  }>
};

export type EditWordSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};
export type EditWordFormValue = FormValue;
export type EditWordInitialData = ({type: "word", word: Word | EditableWord} | {type: "templateWord", word: TemplateWord} | {type: "form", value: EditWordFormValue}) & {forceAdd?: boolean};
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
        invalidateResponses("fetchOldWords", (query) => query.number === dictionary.number && query.wordNumber === word.number),
        invalidateResponses("fetchDictionarySizes", (query) => query.number === dictionary.number)
      ]);
      await onSubmit?.(word);
      dispatchSuccessToast((adding) ? "addWord" : "changeWord");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue<D extends EditWordInitialData | null>(initialData: D): FormValue {
  if (initialData !== null) {
    if (initialData.type === "word") {
      const word = initialData.word;
      const value = {
        number: (initialData.forceAdd) ? null : word.number ?? null,
        spelling: word.spelling,
        pronunciation: word.pronunciation,
        tags: word.tags,
        sections: word.sections.map((section) => ({
          equivalents: section.equivalents.map((equivalent) => ({
            titles: equivalent.titles,
            termString: equivalent.termString,
            hidden: equivalent.hidden
          })),
          informations: section.informations.map((information) => ({
            title: information.title,
            text: information.text,
            hidden: information.hidden
          })),
          phrases: section.phrases.map((phrase) => ({
            titles: phrase.titles,
            expression: phrase.expression,
            termString: phrase.termString
          })),
          variations: section.variations.map((variation) => ({
            title: variation.title,
            spelling: variation.spelling,
            pronunciation: variation.pronunciation
          })),
          relations: section.relations.map((relation) => ({
            titles: relation.titles,
            word: {
              number: relation.number,
              spelling: relation.spelling
            },
            mutual: false
          }))
        }))
      } satisfies FormValue;
      return value;
    } else if (initialData.type === "templateWord") {
      const word = initialData.word;
      const value = {
        number: null,
        spelling: word.spelling,
        pronunciation: word.pronunciation,
        tags: word.tags,
        sections: word.sections.map((section) => ({
          equivalents: section.equivalents.map((equivalent) => ({
            titles: equivalent.titles,
            termString: equivalent.termString,
            hidden: equivalent.hidden
          })),
          informations: section.informations.map((information) => ({
            title: information.title,
            text: information.text,
            hidden: information.hidden
          })),
          variations: section.variations.map((variation) => ({
            title: variation.title,
            spelling: variation.spelling,
            pronunciation: variation.pronunciation
          })),
          phrases: section.phrases.map((phrase) => ({
            titles: phrase.titles,
            expression: phrase.expression,
            termString: phrase.termString
          })),
          relations: section.relations.map((relation) => ({
            titles: relation.titles,
            word: null,
            mutual: false
          }))
        }))
      } satisfies FormValue;
      return value;
    } else if (initialData.type === "form") {
      const value = {
        ...initialData.value,
        number: (initialData.forceAdd) ? null : initialData.value.number
      } satisfies FormValue;
      return value;
    } else {
      initialData satisfies never;
      throw new Error("cannot happen");
    }
  } else {
    return DEFAULT_VALUE;
  }
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"editWord"> {
  const query = {
    number: dictionary.number,
    word: {
      number: value.number ?? null,
      spelling: value.spelling,
      pronunciation: value.pronunciation,
      tags: value.tags,
      sections: value.sections.map((section) => ({
        equivalents: section.equivalents.map((rawEquivalent) => ({
          titles: rawEquivalent.titles,
          terms: createEquivalentTerms(dictionary, rawEquivalent),
          termString: rawEquivalent.termString,
          ignoredPattern: dictionary.settings.ignoredEquivalentPattern,
          hidden: rawEquivalent.hidden
        })),
        informations: section.informations.map((information) => ({
          title: information.title,
          text: information.text,
          hidden: information.hidden
        })),
        phrases: section.phrases.map((phrase) => ({
          titles: phrase.titles,
          expression: phrase.expression,
          terms: createPhraseTerms(dictionary, phrase),
          termString: phrase.termString,
          ignoredPattern: dictionary.settings.ignoredEquivalentPattern
        })),
        variations: section.variations.map((variation) => ({
          title: variation.title,
          spelling: variation.spelling,
          pronunciation: variation.pronunciation
        })),
        relations: section.relations.filter((rawRelation) => rawRelation.word !== null).map((rawRelation) => ({
          titles: rawRelation.titles,
          number: rawRelation.word!.number,
          spelling: rawRelation.word!.spelling
        }))
      }))
    }
  } satisfies RequestData<"editWord">;
  return query;
}

function getQueryForRelations(dictionary: Dictionary, editedWord: Word, value: FormValue): RequestData<"addRelations"> {
  const number = dictionary.number;
  const specs = value.sections.flatMap((section) => section.relations.filter((relation) => relation.word !== null && relation.mutual).map((relation) => {
    const inverseRelation = {
      ...Relation.EMPTY,
      number: editedWord.number,
      spelling: editedWord.spelling,
      titles: relation.titles
    };
    return {wordNumber: relation.word!.number, relation: inverseRelation};
  }));
  const query = {number, specs};
  return query;
}

function createEquivalentTerms(dictionary: Dictionary, rawEquivalent: FormValue["sections"][0]["equivalents"][0]): Array<string> {
  const punctuationRegexp = new RegExp(`[${escapeRegexp(dictionary.settings.punctuations.join(""))}]`);
  const ignoredRegexp = compileIgnoredPattern(dictionary.settings.ignoredEquivalentPattern);
  const ignoredTermString = (ignoredRegexp) ? ignoredRegexp.matcher(rawEquivalent.termString).replaceAll("") : rawEquivalent.termString;
  const terms = ignoredTermString.split(punctuationRegexp).map((term) => term.trim()).filter((term) => term);
  return terms;
}

function createPhraseTerms(dictionary: Dictionary, rawPhrase: FormValue["sections"][0]["phrases"][0]): Array<string> {
  const punctuationRegexp = new RegExp(`[${escapeRegexp(dictionary.settings.punctuations.join(""))}]`);
  const ignoredRegexp = compileIgnoredPattern(dictionary.settings.ignoredEquivalentPattern);
  const ignoredTermString = (ignoredRegexp) ? ignoredRegexp.matcher(rawPhrase.termString).replaceAll("") : rawPhrase.termString;
  const terms = ignoredTermString.split(punctuationRegexp).map((term) => term.trim()).filter((term) => term);
  return terms;
}

function compileIgnoredPattern(ignoredPattern: string | undefined): Re2 | undefined {
  if (ignoredPattern) {
    try {
      return Re2.compile(ignoredPattern);
    } catch (error) {
      return undefined;
    }
  } else {
    return undefined;
  }
}