//

import {ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps} from "zographia";
import {DictionaryList} from "/client-new/component/compound/dictionary-list";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {SearchDictionaryForm} from "/client-new/component/compound/search-dictionary-form";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Search, useSearchState} from "/client-new/hook/search";
import {DictionaryParameter} from "/client-new/skeleton";
import {calcOffsetSpec, resolveStateAction} from "/client-new/util/misc";


export const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const [query, debouncedQuery, setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [[hitDictionaries, hitSize]] = useSuspenseResponse("searchDictionary", {parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 20)}, {keepPreviousData: true});

    const handleParameterSet = useCallback(function (parameter: SetStateAction<DictionaryParameter>): void {
      setQuery((prevQuery) => {
        const nextParameter = resolveStateAction(parameter, prevQuery.parameter);
        return {parameter: nextParameter, page: 0};
      });
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    return (
      <Page headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <div styleName="sticky">
              <SearchDictionaryForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
            </div>
          </div>
          <div styleName="right">
            <DictionaryList dictionaries={hitDictionaries} pageSpec={{size: 40, hitSize, page: query.page, onPageSet: handlePageSet}} showUser={true} showChart={true}/>
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