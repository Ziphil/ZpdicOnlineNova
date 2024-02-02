/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, SetStateAction, useCallback, useMemo} from "react";
import {useHref, useParams} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {Markdown} from "/client-new/component/atom/markdown";
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

    const {trans} = useTrans("dictionaryPage");

    const {identifier} = useParams();
    const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
    const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName}, {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});
    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "own"});
    const enhancedDictionary = useMemo(() => EnhancedDictionary.enhance(dictionary), [dictionary]);

    const [query, debouncedQuery, setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [hitResult] = useSuspenseResponse("searchWord", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 40)}, {keepPreviousData: true});
    const [hitWords, hitSize] = hitResult.words;
    const hitSuggestions = hitResult.suggestions;

    const addWordPageUrl = useHref(`/dictionary/${dictionary.number}/word/new`);

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

    const addWord = useCallback(function (): void {
      window.open(addWordPageUrl);
    }, [addWordPageUrl]);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={enhancedDictionary} width="wide" tabValue="dictionary"/>
        </Fragment>
      )}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <div styleName="sticky">
              <SearchWordForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
              {(canOwn) && (
                <Button variant="light" onClick={addWord}>
                  <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                  {trans("add")}
                </Button>
              )}
            </div>
          </div>
          <div styleName="right">
            {(debouncedQuery.showExplanation) ? (
              <Markdown mode="normal">
                {dictionary.explanation ?? ""}
              </Markdown>
            ) : (
              <WordList dictionary={enhancedDictionary} words={hitWords} size={40} hitSize={hitSize} page={query.page} onPageSet={handlePageSet}/>
            )}
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
