/* eslint-disable react/jsx-closing-bracket-location */

import {faCommentQuestion} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, LoadingIcon, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {Markdown} from "/client/component/atom/markdown";
import {AddProposalDialog} from "/client/component/compound/add-proposal-dialog";
import {SearchWordForm} from "/client/component/compound/search-word-form";
import {SuggestionCard} from "/client/component/compound/suggestion-card";
import {WordList} from "/client/component/compound/word-list";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useSuspenseResponse} from "/client/hook/request";
import {Search, useSearchState} from "/client/hook/search";
import {getDictionarySpecialPaths} from "/client/util/dictionary";
import {calcOffsetSpec, resolveStateAction} from "/client/util/misc";
import {WordParameter} from "/server/internal/skeleton";
import {AddWordButton} from "./add-word-button";


export const DictionaryMainPart = create(
  require("./dictionary-main-part.scss"), "DictionaryMainPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("dictionaryMainPart");

    const dictionary = useDictionary();

    const [authorities] = useSuspenseResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    const [query, debouncedQuery, setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [hitResult, {isFetching}] = useSuspenseResponse("searchWords", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 50)}, {keepPreviousData: true});
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
      <div styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="sticky">
            <SearchWordForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
          </div>
        </div>
        <div styleName="right">
          <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
          {(debouncedQuery.showExplanation && !!dictionary.explanation) && (
            <Markdown styleName="explanation" mode="article" specialPaths={getDictionarySpecialPaths(dictionary)} features={dictionary.settings.markdownFeatures}>
              {dictionary.explanation}
            </Markdown>
          )}
          <div styleName="main">
            <div styleName="header">
              {(authorities?.includes("edit")) ? (
                <AddWordButton dictionary={dictionary}/>
              ) : (dictionary.settings.enableProposal) ? (
                <AddProposalDialog dictionary={dictionary} trigger={(
                  <Button scheme="gray" variant="light">
                    <ButtonIconbag><GeneralIcon icon={faCommentQuestion}/></ButtonIconbag>
                    {trans("button.addProposal")}
                  </Button>
                )}/>
              ) : (
                <div/>
              )}
              <div styleName="size">
                {(isFetching) ? <LoadingIcon/> : transNumber(hitSize)}
              </div>
            </div>
            <SuggestionCard dictionary={dictionary} suggestions={hitSuggestions}/>
            <WordList
              dictionary={dictionary}
              words={hitWords}
              showInfo={true}
              emptyType={(hitSuggestions.length > 0) ? "none" : (authorities?.includes("edit")) ? "create" : "proposal"}
              pageSpec={{size: 50, hitSize, page: query.page, onPageSet: handlePageSet}}
            />
          </div>
        </div>
      </div>
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
