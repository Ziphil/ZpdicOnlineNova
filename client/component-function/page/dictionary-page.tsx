//

import * as queryParser from "query-string";
import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
import {
  useParams
} from "react-router-dom";
import Markdown from "/client/component-function/atom/markdown";
import Loading from "/client/component-function/compound/loading";
import PaginationButton from "/client/component-function/compound/pagination-button";
import SearchForm from "/client/component-function/compound/search-form";
import SuggestionList from "/client/component-function/compound/suggestion-list";
import WordList from "/client/component-function/compound/word-list";
import {
  create
} from "/client/component-function/create";
import {
  useDebounce,
  useQueryState,
  useRequest
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";
import {
  DetailedWord,
  EnhancedDictionary,
  Suggestion,
  WordParameter
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


const DictionaryPage = create(
  require("./dictionary-page.scss"), "DictionaryPage",
  function ({
  }: {
  }): ReactElement {


    let [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    let [getQuery, setQuery] = useQueryState(serializeQuery, deserializeQuery);
    let [hitResult, setHitResult] = useState<DictionaryHitResult>({words: [[], 0], suggestions: []});
    let [canOwn, setCanOwn] = useState(false);
    let [canEdit, setCanEdit] = useState(false);
    let [loading, setLoading] = useState(false);
    let {request} = useRequest();
    let params = useParams<{value: string}>();

    let fetchDictionary = useCallback(async function (): Promise<void> {
      let value = params.value;
      let [number, paramName] = (() => {
        if (value.match(/^\d+$/)) {
          return [+value, undefined] as const;
        } else {
          return [undefined, value] as const;
        }
      })();
      let response = await request("fetchDictionary", {number, paramName});
      if (response.status === 200 && !("error" in response.data)) {
        let dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.value, request]);

    let checkAuthorization = useCallback(async function (): Promise<void> {
      let number = dictionary?.number;
      let ownPromise = (async () => {
        if (number !== undefined) {
          let authority = "own" as const;
          let response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanOwn(true);
          }
        }
      })();
      let editPromise = (async () => {
        if (number !== undefined) {
          let authority = "edit" as const;
          let response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanEdit(true);
          }
        }
      })();
      await Promise.all([ownPromise, editPromise]);
    }, [dictionary?.number, request]);

    let updateWordsImmediately = useCallback(async function (overrides: {parameter?: WordParameter, page?: number}, options?: UpdateWordsOptions): Promise<void> {
      let number = dictionary?.number;
      if (number !== undefined) {
        let query = getQuery();
        let usedParameter = overrides?.parameter ?? query.parameter;
        let usedPage = overrides?.page ?? query.page;
        let offset = usedPage * 40;
        let size = 40;
        setLoading(true);
        let response = await request("searchDictionary", {number, parameter: usedParameter, offset, size});
        if (response.status === 200 && !("error" in response.data)) {
          let hitResult = response.data;
          setHitResult(hitResult);
          setLoading(false);
        } else {
          setHitResult({words: [[], 0], suggestions: []});
          setLoading(false);
        }
      }
    }, [dictionary?.number, getQuery, request]);

    let updateWords = useDebounce(async function (overrides: {parameter?: WordParameter, page?: number}, options?: UpdateWordsOptions): Promise<void> {
      await updateWordsImmediately(overrides, options);
    }, 500, [updateWordsImmediately]);

    let handleParameterSet = useCallback(async function (parameter: WordParameter): Promise<void> {
      let page = 0;
      setQuery((query) => ({...query, parameter, page}));
    }, [setQuery]);

    let handlePageSet = useCallback(async function (page: number): Promise<void> {
      window.scrollTo(0, 0);
      setQuery((query) => ({...query, page}));
    }, [setQuery]);

    useEffect(() => {
      updateWords({});
    }, [getQuery()]);

    useEffect(() => {
      fetchDictionary();
    }, [params.value]);

    useEffect(() => {
      checkAuthorization();
      updateWordsImmediately({});
    }, [dictionary]);

    let wordListProps = {dictionary, getQuery, canEdit, hitResult, updateWordsImmediately, handlePageSet};
    let innerNode = (dictionary !== null) && (
      (getQuery().showExplanation) ? <Markdown source={dictionary.explanation ?? ""}/> : <DictionaryPageWordList {...wordListProps}/>
    );
    let node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <Loading loading={dictionary === null}>
          <div styleName="search-form">
            <SearchForm dictionary={dictionary!} parameter={getQuery().parameter} showOrder={true} showAdvancedSearch={true} onParameterSet={handleParameterSet}/>
          </div>
          {innerNode}
        </Loading>
      </Page>
    );
    return node;

  }
);


const DictionaryPageWordList = create(
  require("./dictionary-page.scss"),
  function ({
    dictionary,
    getQuery,
    canEdit,
    hitResult,
    updateWordsImmediately,
    handlePageSet
  }: {
    dictionary: EnhancedDictionary | null,
    getQuery: () => DictionaryQuery,
    canEdit: boolean,
    hitResult: DictionaryHitResult,
    updateWordsImmediately: (overrides: {}) => Promise<void>,
    handlePageSet: (page: number) => Promise<void>
  }): ReactElement {

    let [hitWords, hitSize] = hitResult.words;
    let hitSuggestions = hitResult.suggestions;
    let maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    let node = (
      <Fragment>
        <div styleName="suggestion-list">
          <SuggestionList
            dictionary={dictionary!}
            suggestions={hitSuggestions}
          />
        </div>
        <div styleName="word-list">
          <WordList
            dictionary={dictionary!}
            words={hitWords}
            showEditLink={canEdit}
            offset={0}
            size={40}
            onEditConfirm={() => updateWordsImmediately({})}
            onDiscardConfirm={() => updateWordsImmediately({})}
            onEditExampleConfirm={() => updateWordsImmediately({})}
            onDiscardExampleConfirm={() => updateWordsImmediately({})}
          />
        </div>
        <div styleName="pagination">
          <PaginationButton page={getQuery().page} minPage={0} maxPage={maxPage} onSet={handlePageSet}/>
        </div>
      </Fragment>
    );
    return node;

  }
);


function serializeQuery(query: DictionaryQuery): string {
  let queryString = query.parameter.serialize() + `&page=${query.page}`;
  return queryString;
}

function deserializeQuery(queryString: string): DictionaryQuery {
  let rawQuery = queryParser.parse(queryString);
  let parameter = WordParameter.deserialize(queryString);
  let page = (typeof rawQuery.page === "string") ? +rawQuery.page : 0;
  let showExplanation = Object.keys(rawQuery).length <= 0;
  return {parameter, page, showExplanation};
}

export type DictionaryHitResult = {words: WithSize<DetailedWord>, suggestions: Array<Suggestion>};
export type DictionaryQuery = {parameter: WordParameter, page: number, showExplanation: boolean};
export type UpdateWordsOptions = {serialize?: boolean, keepShowExplanation?: boolean};

export default DictionaryPage;