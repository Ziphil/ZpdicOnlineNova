//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import DictionaryList from "/client/component/compound/dictionary-list";
import DictionarySearchForm from "/client/component/compound/dictionary-search-form";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useMediaQuery,
  useQueryState,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  DetailedDictionary,
  DictionaryParameter
} from "/client/skeleton/dictionary";
import {
  calcOffset
} from "/client/util/misc";
import {
  WithSize
} from "/server/controller/internal/type";


const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {smartphone} = useMediaQuery();

    const [query, debouncedQuery, setQuery] = useQueryState(serializeQuery, deserializeQuery, 500);
    const [[hitDictionaries, hitSize]] = useSuspenseQuery("searchDictionary", {parameter: debouncedQuery.parameter, ...calcOffset(query.page, 20)}, {keepPreviousData: true});

    const handleParameterSet = useCallback(function (parameter: DictionaryParameter): void {
      setQuery({...query, parameter, page: 0});
    }, [query, setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    const column = (smartphone) ? 1 : 2;
    const node = (
      <Page title={trans("dictionaryListPage.title")}>
        <div styleName="search-form-container">
          <DictionarySearchForm parameter={query.parameter} showOrder={true} enableHotkeys={true} onParameterSet={handleParameterSet}/>
        </div>
        <div styleName="list-container">
          <DictionaryList dictionaries={hitDictionaries} column={column} size={20} hitSize={hitSize} page={query.page} onPageSet={handlePageSet} showCreatedDate={true}/>
        </div>
      </Page>
    );
    return node;

  }
);


function serializeQuery(query: DictionaryQuery): Record<string, unknown> {
  const search = {...query.parameter.serialize(), page: query.page};
  return search;
}

function deserializeQuery(search: Record<string, unknown>): DictionaryQuery {
  const parameter = DictionaryParameter.deserialize(search);
  const page = (typeof search.page === "string") ? +search.page : 0;
  return {parameter, page};
}

export type DictionaryHitResult = WithSize<DetailedDictionary>;
export type DictionaryQuery = {parameter: DictionaryParameter, page: number};


export default DictionaryListPage;