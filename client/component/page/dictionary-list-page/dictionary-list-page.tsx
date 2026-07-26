//

import {ReactElement, useCallback} from "react";
import {AdditionalProps, LoadingIcon, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {DictionaryList} from "/client/component/compound/dictionary-list";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {SearchDictionaryForm} from "/client/component/compound/search-dictionary-form";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Search, useSearchQuery} from "/client/hook/search";
import {calcOffsetSpec} from "/client/util/misc";
import {DictionaryParameter} from "/server/internal/skeleton";


export const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("dictionaryListPage");

    const [query, setQuery] = useSearchQuery({serializeQuery, deserializeQuery});
    const [[hitDictionaries, hitSize], {isFetching}] = useSuspenseResponse("searchDictionaries", {parameter: query.parameter, ...calcOffsetSpec(query.page, 50)}, {keepPreviousData: true});

    const handleParameterCommit = useCallback(function (parameter: DictionaryParameter): void {
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
              <SearchDictionaryForm styleName="form" parameter={query.parameter} onParameterCommit={handleParameterCommit}/>
            </div>
          </div>
          <div styleName="right">
            <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
            <div styleName="content">
              <div styleName="header">
                <div styleName="size">
                  {(isFetching) ? <LoadingIcon/> : transNumber(hitSize)}
                </div>
              </div>
              <DictionaryList dictionaries={hitDictionaries} type="all" pageSpec={{size: 50, hitSize, page: query.page, onPageSet: handlePageSet}} showUser={true} showChart={true}/>
            </div>
          </div>
        </MainContainer>
      </Page>
    );

  }
);


function serializeQuery(query: DictionaryQuery): Search {
  const search = DictionaryParameter.serialize(query.parameter);
  search.set("page", query.page.toString());
  return search;
}

function deserializeQuery(search: Search): DictionaryQuery {
  const parameter = DictionaryParameter.deserialize(search);
  const page = (search.get("page") !== null) ? +search.get("page")! : 0;
  return {parameter, page};
}

type DictionaryQuery = {parameter: DictionaryParameter, page: number};