//

import {ReactElement, useCallback, useMemo} from "react";
import {AdditionalProps} from "zographia";
import {DictionaryList} from "/client/component/compound/dictionary-list";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {SearchDictionaryForm} from "/client/component/compound/search-dictionary-form";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Search, useSearch} from "/client/hook/search";
import {calcOffsetSpec} from "/client/util/misc";
import {DictionaryParameter} from "/server/internal/skeleton";


export const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const [search, setSearch] = useSearch();
    const query = useMemo(() => deserializeQuery(search), [search]);
    const [[hitDictionaries, hitSize]] = useSuspenseResponse("searchDictionaries", {parameter: query.parameter, ...calcOffsetSpec(query.page, 50)}, {keepPreviousData: true});

    const handleParameterCommit = useCallback(function (parameter: DictionaryParameter): void {
      setSearch(serializeQuery({parameter, page: 0}), {replace: true});
    }, [setSearch]);

    const handlePageSet = useCallback(function (page: number): void {
      setSearch((prevSearch) => {
        const nextSearch = new URLSearchParams(prevSearch);
        nextSearch.set("page", page.toString());
        return nextSearch;
      });
      window.scrollTo(0, 0);
    }, [setSearch]);

    return (
      <Page headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <div styleName="sticky">
              <SearchDictionaryForm styleName="form" parameter={query.parameter} onParameterCommit={handleParameterCommit}/>
            </div>
          </div>
          <div styleName="right">
            <DictionaryList dictionaries={hitDictionaries} type="all" pageSpec={{size: 50, hitSize, page: query.page, onPageSet: handlePageSet}} showUser={true} showChart={true}/>
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