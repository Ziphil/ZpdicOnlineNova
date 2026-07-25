//

import {ReactElement, useCallback} from "react";
import {AdditionalProps, LoadingIcon, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {SimpleSearchWordForm} from "/client/component/compound/simple-search-word-form";
import {SimpleWordList} from "/client/component/compound/simple-word-list";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Search, useSearchQuery} from "/client/hook/search";
import {calcOffsetSpec} from "/client/util/misc";
import {WordParameter} from "/server/internal/skeleton";


export const SearchWordsGloballyPage = create(
  require("./search-words-globally-page.scss"), "SearchWordsGloballyPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("searchWordsGloballyPage");

    const [query, setQuery] = useSearchQuery({serializeQuery, deserializeQuery});
    const [[hitWords, hitSize], {isFetching}] = useSuspenseResponse("searchWordsGlobally", {parameter: query.parameter, ...calcOffsetSpec(query.page, 50)}, {keepPreviousData: true});

    const showHitSizeCap = query.parameter.kind === "normal" && query.parameter.options.shuffleSeed !== null && hitSize >= 50;

    const handleParameterCommit = useCallback(function (parameter: WordParameter): void {
      setQuery({parameter, page: 0}, {replace: true});
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery((prevQuery) => ({...prevQuery, page}));
      window.scrollTo(0, 0);
    }, [setQuery]);

    return (
      <Page title={trans("title")} headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <div styleName="sticky">
              <SimpleSearchWordForm styleName="form" parameter={query.parameter} onParameterCommit={handleParameterCommit}/>
            </div>
          </div>
          <div styleName="right">
            <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
            <div styleName="content">
              <div styleName="header">
                <div styleName="size">
                  {(isFetching) ? <LoadingIcon/> : (showHitSizeCap) ? <>{transNumber(50)}+</> : transNumber(hitSize)}
                </div>
              </div>
              <SimpleWordList
                words={hitWords}
                pageSpec={{size: 50, hitSize, page: query.page, onPageSet: handlePageSet}}
              />
            </div>
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
  return {parameter, page};
}

type WordQuery = {parameter: WordParameter, page: number};
