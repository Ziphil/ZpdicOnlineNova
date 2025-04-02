//

import {BaseSyntheticEvent, useMemo} from "react";
import {UseFormReturn, useForm} from "/client/hook/form";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Article, Dictionary, EditableArticle} from "/client/skeleton";
import {switchResponse} from "/client/util/response";
import type {RequestData} from "/server/internal/type/rest";


const DEFAULT_VALUE = {
  number: null,
  tags: [],
  title: "",
  content: ""
} satisfies FormValue;
type FormValue = {
  number: number | null,
  tags: Array<string>,
  title: string,
  content: string
};

export type EditArticleSpec = {
  form: UseFormReturn<FormValue>,
  handleSubmit: (event: BaseSyntheticEvent) => void
};
export type EditArticleFormValue = FormValue;
export type EditArticleInitialData = {type: "article", article: Article} | {type: "form", value: EditArticleFormValue};
export const getEditArticleFormValue = getFormValue;

export function useEditArticle(dictionary: Dictionary, initialData: EditArticleInitialData | null, onSubmit?: (article: EditableArticle) => unknown): EditArticleSpec {
  const form = useForm<FormValue>(getFormValue(initialData), {});
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const handleSubmit = useMemo(() => form.handleSubmit(async (value) => {
    const adding = value.number === null;
    const query = getQuery(dictionary, value);
    const response = await request("editArticle", query);
    await switchResponse(response, async (article) => {
      form.setValue("number", article.number);
      await Promise.all([
        invalidateResponses("searchArticles", (query) => query.number === dictionary.number),
        invalidateResponses("fetchArticle", (query) => query.number === dictionary.number && query.articleNumber === article.number)
      ]);
      await onSubmit?.(query.article);
      dispatchSuccessToast((adding) ? "addArticle" : "changeArticle");
    });
  }), [dictionary, onSubmit, request, form, dispatchSuccessToast]);
  return {form, handleSubmit};
}

function getFormValue(initialData: EditArticleInitialData | null): FormValue {
  if (initialData !== null) {
    if (initialData.type === "article") {
      const example = initialData.article;
      const value = {
        number: example.number,
        tags: example.tags,
        title: example.title,
        content: example.content
      } satisfies FormValue;
      return value;
    } else {
      return initialData.value;
    }
  } else {
    return DEFAULT_VALUE;
  }
}

function getQuery(dictionary: Dictionary, value: FormValue): RequestData<"editArticle"> {
  const query = {
    number: dictionary.number,
    article: {
      number: value.number ?? null,
      tags: value.tags,
      title: value.title,
      content: value.content
    }
  } satisfies RequestData<"editArticle">;
  return query;
}