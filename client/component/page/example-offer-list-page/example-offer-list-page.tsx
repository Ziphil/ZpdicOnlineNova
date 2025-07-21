//

import {ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {SearchExampleOfferForm} from "/client/component/compound/search-example-offer-form";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Search, useSearchState} from "/client/hook/search";
import {calcOffsetSpec, resolveStateAction} from "/client/util/misc";
import {ExampleOfferParameter} from "/server/internal/skeleton";


export const ExampleOfferListPage = create(
  require("./example-offer-list-page.scss"), "ExampleOfferListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleOfferListPage");

    const [query, , setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [[hitOffers, hitSize]] = useSuspenseResponse("searchExampleOffers", {parameter: query.parameter, ...calcOffsetSpec(query.page, 10)}, {keepPreviousData: true});

    const handleParameterSet = useCallback(function (parameter: SetStateAction<ExampleOfferParameter>): void {
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
      <Page title={trans("title")} headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <div styleName="sticky">
              <SearchExampleOfferForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
            </div>
          </div>
          <div styleName="right">
            <ExampleOfferList offers={hitOffers} pageSpec={{size: 10, hitSize, page: query.page, onPageSet: handlePageSet}} showExamples={true}/>
          </div>
        </MainContainer>
      </Page>
    );

  }
);


function serializeQuery(query: ExampleOfferQuery): Search {
  const search = ExampleOfferParameter.serialize(query.parameter);
  search.set("page", query.page.toString());
  return search;
}

function deserializeQuery(search: Search): ExampleOfferQuery {
  const parameter = ExampleOfferParameter.deserialize(search);
  const page = (search.get("page") !== null) ? +search.get("page")! : 0;
  return {parameter, page};
}

type ExampleOfferQuery = {parameter: ExampleOfferParameter, page: number};