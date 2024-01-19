/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, SetStateAction, useCallback, useMemo} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {SearchWordForm} from "/client-new/component/compound/search-word-form";
import {WordList} from "/client-new/component/compound/word-list";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Search, useSearchState} from "/client-new/hook/search";
import {EnhancedDictionary, WordParameter} from "/client-new/skeleton";
import {calcOffsetSpec, resolveStateAction} from "/client-new/util/misc";


export const DictionaryPage = create(
  require("./dictionary-page.scss"), "DictionaryPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {identifier} = useParams();
    const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
    const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName}, {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});
    const enhancedDictionary = useMemo(() => EnhancedDictionary.enhance(dictionary), [dictionary]);

    const [query, debouncedQuery, setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [hitResult] = useSuspenseResponse("searchWord", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 40)}, {keepPreviousData: true});
    const [hitWords, hitSize] = hitResult.words;
    const hitSuggestions = hitResult.suggestions;

    const handleParameterSet = useCallback(function (parameter: SetStateAction<WordParameter>): void {
      setQuery((prevQuery) => {
        const nextParameter = resolveStateAction(parameter, prevQuery.parameter);
        return {parameter: nextParameter, page: 0, showExplanation: false};
      });
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={enhancedDictionary} tabValue="dictionary"/>
        </Fragment>
      )}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <SearchWordForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
          </div>
          <div styleName="right">
            <WordList dictionary={enhancedDictionary} words={hitWords} size={40} hitSize={hitSize} page={query.page} onPageSet={handlePageSet}/>
          </div>
        </MainContainer>
      </Page>
    );

  }
);


function serializeQuery(query: WordQuery): Search {
  const search = WordParameter.serialize(query.parameter);
  search.set("page", query.page.toString());
  return search;
}

function deserializeQuery(search: Search): WordQuery {
  const parameter = WordParameter.deserialize(search);
  const page = (search.get("page") !== null) ? +search.get("page")! : 0;
  const showExplanation = search.size <= 0;
  return {parameter, page, showExplanation};
}

export type WordQuery = {parameter: WordParameter, page: number, showExplanation: boolean};
