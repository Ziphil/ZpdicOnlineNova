//

import {ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps} from "zographia";
import {DictionaryList} from "/client-new/component/compound/dictionary-list";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {SearchDictionaryForm} from "/client-new/component/compound/search-dictionary-form";
import {create} from "/client-new/component/create";
import {useParamsState} from "/client-new/hook/params-state";
import {useSuspenseQuery} from "/client-new/hook/request";
import {DictionaryParameter} from "/client-new/skeleton";
import {calcOffsetSpec, resolveStateAction} from "/client-new/util/misc";


export const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const [query, debouncedQuery, setQuery] = useParamsState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [[hitDictionaries, hitSize]] = useSuspenseQuery("searchDictionary", {parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 20)}, {keepPreviousData: true});

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
      <Page {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <SearchDictionaryForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
          </div>
          <div styleName="right">
            <DictionaryList dictionaries={hitDictionaries} size={20} hitSize={hitSize} page={query.page} onPageSet={handlePageSet}/>
          </div>
        </MainContainer>
      </Page>
    );

  }
);


function serializeQuery(query: DictionaryQuery): URLSearchParams {
  const params = DictionaryParameter.serialize(query.parameter);
  params.set("page", query.page.toString());
  return params;
}

function deserializeQuery(params: URLSearchParams): DictionaryQuery {
  const parameter = DictionaryParameter.deserialize(params);
  const page = (params.get("page") !== null) ? +params.get("page")! : 0;
  return {parameter, page};
}

type DictionaryQuery = {parameter: DictionaryParameter, page: number};