//

import {BaseSyntheticEvent, useMemo} from "react";
import {ObjectSchema, array, boolean, mixed, object, string} from "yup";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {testArrayStringLength} from "/client/util/validation";
import {Dictionary, DictionaryLimits, EditableTemplateWord, ObjectId, TemplateWord} from "/server/internal/skeleton";
import {DICTIONARY_LIMITS} from "/server/model/constant";


const DEFAULT_VALUE = {
  id: null,
  title: "",
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
  id: ObjectId | null,
  title: string,
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
      termString: string,
      text: string,
      hidden: boolean
    }>,
    variations: Array<{
      title: string,
      spelling: string,
      pronunciation: string
    }>,
    relations: Array<{
      titles: Array<string>
    }>
  }>
};

export type EditTemplateWordSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};
export type EditTemplateWordFormValue = FormValue;
export type EditTemplateWordInitialData = ({type: "word", word: TemplateWord | EditableTemplateWord} | {type: "form", value: EditTemplateWordFormValue}) & {forceAdd?: boolean};
export const getEditTemplateWordFormValue = getFormValue;

export function useEditTemplateWord(dictionary: Dictionary, initialData: EditTemplateWordInitialData | null, onSubmit?: () => unknown): EditTemplateWordSpec {
  const schema = useMemo(() => createSchema(dictionary.limits.word), [dictionary.limits.word]);
  const form = useForm<FormValue>(schema, getFormValue(initialData), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const adding = value.id === null;
    const response = await request("editDictionaryTemplateWord", {number: dictionary.number, word: value});
    await switchResponse(response, async () => {
      await Promise.all([
        invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName)
      ]);
      await onSubmit?.();
      dispatchSuccessToast((adding) ? "addDictionaryTemplateWord" : "changeDictionaryTemplateWord");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function createSchema(limits: DictionaryLimits["word"]): ObjectSchema<FormValue> {
  const schema = object({
    id: mixed<ObjectId>().nullable().defined(),
    title: string().max(DICTIONARY_LIMITS.templateWord.titleLength, "titleTooLong").defined(),
    spelling: string().max(limits.spellingLength, "spellingTooLong").defined(),
    pronunciation: string().max(limits.pronunciationLength, "pronunciationTooLong").defined(),
    tags: array(string().defined()).max(limits.tagCount, "tagsTooMany").test(testArrayStringLength(limits.tagLength, "tagTooLong")).defined(),
    sections: array(object({
      equivalents: array(object({
        titles: array(string().defined()).defined(),
        termString: string().defined(),
        hidden: boolean().defined()
      })).defined(),
      informations: array(object({
        title: string().max(limits.informationTitleLength, "informationTitleTooLong").defined(),
        text: string().max(limits.informationTextLength, "informationTextTooLong").defined(),
        hidden: boolean().defined()
      })).defined(),
      phrases: array(object({
        titles: array(string().defined()).defined(),
        expression: string().defined(),
        termString: string().defined(),
        text: string().defined(),
        hidden: boolean().defined()
      })).defined(),
      variations: array(object({
        title: string().defined(),
        spelling: string().defined(),
        pronunciation: string().defined()
      })).defined(),
      relations: array(object({
        titles: array(string().defined()).defined()
      })).defined()
    })).defined()
  });
  return schema;
}

function getFormValue<D extends EditTemplateWordInitialData | null>(initialData: D): FormValue {
  if (initialData !== null) {
    if (initialData.type === "word") {
      const word = initialData.word;
      const value = {
        id: (initialData.forceAdd) ? null : word.id ?? null,
        title: word.title,
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
            termString: phrase.termString,
            text: phrase.text,
            hidden: phrase.hidden
          })),
          variations: section.variations.map((variation) => ({
            title: variation.title,
            spelling: variation.spelling,
            pronunciation: variation.pronunciation
          })),
          relations: section.relations.map((relation) => ({
            titles: relation.titles
          }))
        }))
      } satisfies FormValue;
      return value;
    } else if (initialData.type === "form") {
      const value = {
        ...initialData.value,
        id: (initialData.forceAdd) ? null : initialData.value.id
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