//

import {
  Fragment,
  ReactElement,
  Suspense,
  useCallback
} from "react";
import GoogleAd from "/client/component/atom/google-ad";
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
  useParams,
  useQueryState,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  DetailedWord,
  EnhancedDictionary,
  Suggestion,
  WordParameter
} from "/client/skeleton/dictionary";
import {
  calcOffset
} from "/client/util/misc";
import {
  WithSize
} from "/server/controller/internal/type";


const DictionaryPage = create(
  require("./dictionary-page.scss"), "DictionaryPage",
  function ({
  }: {
  }): ReactElement {

    const params = useParams();

    const value = params.value;
    const [number, paramName] = value.match(/^\d+$/) ? [+value, undefined] : [undefined, value];
    const [dictionary] = useSuspenseQuery("fetchDictionary", {number, paramName}, {}, EnhancedDictionary.enhance);
    const [canOwn] = useSuspenseQuery("fetchDictionaryAuthorization", {number: dictionary.number, authority: "own"});
    const [canEdit] = useSuspenseQuery("fetchDictionaryAuthorization", {number: dictionary.number, authority: "edit"});
    const [query, debouncedQuery, setQuery] = useQueryState(serializeQuery, deserializeQuery, 500);

    const handleParameterSet = useCallback(function (parameter: WordParameter): void {
      setQuery({...query, parameter, page: 0, showExplanation: false});
    }, [query, setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page, showExplanation: false});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    const node = (
      <Page dictionary={dictionary} showDictionary={true} showAddLink={canEdit} showSettingLink={canOwn}>
        <div styleName="search-form-container">
          <WordSearchForm dictionary={dictionary} parameter={query.parameter} showOrder={true} showAdvancedSearch={true} enableHotkeys={true} onParameterSet={handleParameterSet}/>
        </div>
        <div styleName="ad-wrapper">
          <div styleName="ad-container">
            <GoogleAd clientId="9429549748934508" slotId="2898231395"/>
          </div>
        </div>
        {(debouncedQuery.showExplanation) ? (
          <Markdown source={dictionary.explanation ?? ""}/>
        ) : (
          <Suspense fallback={<Loading/>}>
            <DictionaryPageWordList {...{dictionary, query, debouncedQuery, canEdit, handlePageSet}}/>
          </Suspense>
        )}
      </Page>
    );
    return node;

  }
);


const DictionaryPageWordList = create(
  require("./dictionary-page.scss"), "DictionaryPageWordList",
  function ({
    dictionary,
    query,
    debouncedQuery,
    canEdit,
    handlePageSet
  }: {
    dictionary: EnhancedDictionary,
    query: WordQuery,
    debouncedQuery: WordQuery,
    canEdit: boolean,
    handlePageSet: (page: number) => unknown
  }): ReactElement {

    const [hitResult] = useSuspenseQuery("searchWord", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffset(query.page, 40)}, {keepPreviousData: true});

    const [hitWords, hitSize] = hitResult.words;
    const hitSuggestions = hitResult.suggestions;
    const maxPage = Math.max(Math.ceil(hitSize / 40) - 1, 0);
    const node = (
      <Fragment>
        <div styleName="suggestion-list-container">
          <SuggestionList dictionary={dictionary} suggestions={hitSuggestions}/>
        </div>
        <div styleName="word-list-container">
          <WordList dictionary={dictionary} words={hitWords} showEditLink={canEdit} offset={0} size={40}/>
        </div>
        <div styleName="pagination-container">
          <PaginationButton page={query.page} minPage={0} maxPage={maxPage} enableHotkeys={true} onSet={handlePageSet}/>
        </div>
      </Fragment>
    );
    return node;

  }
);


function serializeQuery(query: WordQuery): Record<string, unknown> {
  const search = {...query.parameter.serialize(), page: query.page};
  return search;
}

function deserializeQuery(search: Record<string, unknown>): WordQuery {
  const parameter = WordParameter.deserialize(search);
  const page = (typeof search.page === "string") ? +search.page : 0;
  const showExplanation = Object.keys(search).length <= 0;
  return {parameter, page, showExplanation};
}

export type WordHitResult = {words: WithSize<DetailedWord>, suggestions: Array<Suggestion>};
export type WordQuery = {parameter: WordParameter, page: number, showExplanation: boolean};
export type UpdateWordsOptions = {serialize?: boolean, keepShowExplanation?: boolean};

export default DictionaryPage;