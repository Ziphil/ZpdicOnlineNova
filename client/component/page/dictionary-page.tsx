//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
import Markdown from "/client/component/atom/markdown";
import Loading from "/client/component/compound/loading";
import PaginationButton from "/client/component/compound/pagination-button";
import SuggestionList from "/client/component/compound/suggestion-list";
import WordList from "/client/component/compound/word-list";
import WordSearchForm from "/client/component/compound/word-search-form";
import {
  create
} from "/client/component/create";
import {
  useDebounce,
  useParams,
  useQueryState,
  useRequest
} from "/client/component/hook";
import Page from "/client/component/page/page";
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

    const [dictionary, setDictionary] = useState<EnhancedDictionary | null>(null);
    const [getQuery, setQuery] = useQueryState(serializeQuery, deserializeQuery);
    const [hitResult, setHitResult] = useState<DictionaryHitResult>({words: [[], 0], suggestions: []});
    const [canOwn, setCanOwn] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [searching, setSearching] = useState(false);
    const {request} = useRequest();
    const params = useParams();

    const fetchDictionary = useCallback(async function (): Promise<void> {
      const value = params.value;
      const [number, paramName] = (() => {
        if (value.match(/^\d+$/)) {
          return [+value, undefined] as const;
        } else {
          return [undefined, value] as const;
        }
      })();
      const response = await request("fetchDictionary", {number, paramName});
      if (response.status === 200 && !("error" in response.data)) {
        const dictionary = EnhancedDictionary.enhance(response.data);
        setDictionary(dictionary);
      } else {
        setDictionary(null);
      }
    }, [params.value, request]);

    const checkAuthorization = useCallback(async function (): Promise<void> {
      const number = dictionary?.number;
      const ownPromise = (async () => {
        if (number !== undefined) {
          const authority = "own" as const;
          const response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanOwn(true);
          }
        }
      })();
      const editPromise = (async () => {
        if (number !== undefined) {
          const authority = "edit" as const;
          const response = await request("checkDictionaryAuthorization", {number, authority}, {ignoreError: true});
          if (response.status === 200) {
            setCanEdit(true);
          }
        }
      })();
      await Promise.all([ownPromise, editPromise]);
    }, [dictionary?.number, request]);

    const updateWordsImmediately = useCallback(async function (): Promise<void> {
      const number = dictionary?.number;
      if (number !== undefined) {
        const query = getQuery();
        const usedParameter = query.parameter;
        const usedPage = query.page;
        const offset = usedPage * 40;
        const size = 40;
        setSearching(true);
        const response = await request("searchDictionary", {number, parameter: usedParameter, offset, size});
        if (response.status === 200 && !("error" in response.data)) {
          const hitResult = response.data;
          setHitResult(hitResult);
          setSearching(false);
        } else {
          setHitResult({words: [[], 0], suggestions: []});
          setSearching(false);
        }
      }
    }, [dictionary?.number, getQuery, request]);

    const updateWords = useDebounce(async function (): Promise<void> {
      await updateWordsImmediately();
    }, 500, [updateWordsImmediately]);

    const handleParameterSet = useCallback(async function (parameter: WordParameter): Promise<void> {
      const page = 0;
      const showExplanation = false;
      setQuery((query) => ({...query, parameter, page, showExplanation}));
    }, [setQuery]);

    const handlePageSet = useCallback(async function (page: number): Promise<void> {
      const showExplanation = false;
      setQuery((query) => ({...query, page, showExplanation}));
      window.scrollTo(0, 0);
    }, [setQuery]);

    useEffect(() => {
      updateWords();
    }, [getQuery()]);

    useEffect(() => {
      fetchDictionary();
    }, [params.value]);

    useEffect(() => {
      checkAuthorization();
      updateWordsImmediately();
    }, [dictionary]);

    const wordListProps = {dictionary, getQuery, canEdit, hitResult, updateWordsImmediately, handlePageSet};
    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <Loading loading={dictionary === null}>
          <div styleName="search-form-container">
            <WordSearchForm dictionary={dictionary!} parameter={getQuery().parameter} searching={searching} showOrder={true} showAdvancedSearch={true} enableHotkeys={true} onParameterSet={handleParameterSet}/>
          </div>
          {(dictionary !== null) && (
            (getQuery().showExplanation) ? <Markdown source={dictionary.explanation ?? ""}/> : <DictionaryPageWordList {...wordListProps}/>
          )}
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
    updateWordsImmediately: () => Promise<void>,
    handlePageSet: (page: number) => Promise<void>
  }): ReactElement {

    const [hitWords, hitSize] = hitResult.words;
    const hitSuggestions = hitResult.suggestions;
    const maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    const node = (
      <Fragment>
        <div styleName="suggestion-list-container">
          <SuggestionList
            dictionary={dictionary!}
            suggestions={hitSuggestions}
          />
        </div>
        <div styleName="word-list-container">
          <WordList
            dictionary={dictionary!}
            words={hitWords}
            showEditLink={canEdit}
            offset={0}
            size={40}
            onEditConfirm={updateWordsImmediately}
            onDiscardConfirm={updateWordsImmediately}
            onEditExampleConfirm={updateWordsImmediately}
            onDiscardExampleConfirm={updateWordsImmediately}
          />
        </div>
        <div styleName="pagination">
          <PaginationButton page={getQuery().page} minPage={0} maxPage={maxPage} enableHotkeys={true} onSet={handlePageSet}/>
        </div>
      </Fragment>
    );
    return node;

  }
);


function serializeQuery(query: DictionaryQuery): Record<string, unknown> {
  const search = {...query.parameter.serialize(), page: query.page};
  return search;
}

function deserializeQuery(search: Record<string, unknown>): DictionaryQuery {
  const parameter = WordParameter.deserialize(search);
  const page = (typeof search.page === "string") ? +search.page : 0;
  const showExplanation = Object.keys(search).length <= 0;
  return {parameter, page, showExplanation};
}

export type DictionaryHitResult = {words: WithSize<DetailedWord>, suggestions: Array<Suggestion>};
export type DictionaryQuery = {parameter: WordParameter, page: number, showExplanation: boolean};
export type UpdateWordsOptions = {serialize?: boolean, keepShowExplanation?: boolean};

export default DictionaryPage;