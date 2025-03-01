//

import {LoaderFunctionArgs} from "react-router-dom";
import rison from "rison";
import {EditArticleInitialData} from "/client/component/compound/edit-article-form";
import {fetchResponse} from "/client/hook/request";
import {DictionaryWithUser} from "/client/skeleton";
import {ResponseError} from "/client/util/response-error";


export type EditArticlePageLoaderData = {
  dictionary: DictionaryWithUser,
  initialData: EditArticleInitialData | null
};

export async function loadEditArticlePage({params, request}: LoaderFunctionArgs): Promise<EditArticlePageLoaderData> {
  const {identifier, articleNumber} = params;;
  const encodedValue = new URL(request.url).searchParams.get("value");
  if (identifier !== undefined) {
    try {
      const dictionary = await fetchResponse("fetchDictionary", {identifier});
      if (encodedValue !== null) {
        try {
          const value = rison.decode<any>(encodedValue);
          return {dictionary, initialData: {type: "form", value}};
        } catch (error) {
          return {dictionary, initialData: null};
        }
      } else {
        if (articleNumber !== undefined) {
          return {dictionary, initialData: null};
        } else {
          return {dictionary, initialData: null};
        }
      }
    } catch (error) {
      throw convertError(error);
    }
  } else {
    throw new Response(null, {status: 404});
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDictionary" || error.type === "noSuchArticle") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}