//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, EditableTemplateWord, ObjectId, TemplateWord} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


const DEFAULT_VALUE = {
  id: null,
  title: "",
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
  id: ObjectId | null,
  title: string,
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
    titles: Array<string>
  }>
};

export type EditTemplateWordSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};
export type EditTemplateWordFormValue = FormValue;
export type EditTemplateWordInitialData = ({type: "word", word: TemplateWord | EditableTemplateWord} | {type: "form", value: EditTemplateWordFormValue}) & {forceAdd?: boolean};
export const getEditTemplateWordFormValue = getFormValue;

export function useTemplateEditWord(dictionary: Dictionary, initialData: EditTemplateWordInitialData | null, onSubmit?: () => unknown): EditTemplateWordSpec {
  const form = useForm<FormValue>(getFormValue(initialData), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const response = await request("editDictionaryTemplateWord", {number: dictionary.number, word: value});
    await switchResponse(response, async () => {
      await Promise.all([
        invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName)
      ]);
      await onSubmit?.();
      dispatchSuccessToast("changeDictionarySettings");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue<D extends EditTemplateWordInitialData | null>(initialData: D): FormValue {
  if (initialData !== null) {
    if (initialData.type === "word") {
      const word = initialData.word;
      const value = {
        id: (initialData.forceAdd) ? null : word.id ?? null,
        title: word.title,
        name: word.name,
        pronunciation: word.pronunciation,
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
          titles: relation.titles
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