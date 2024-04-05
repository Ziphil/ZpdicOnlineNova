//

import {ReactElement, useCallback} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {Search, useSearchState} from "/client/hook/search";
import {calcOffsetSpec} from "/client/util/misc";


export const ExampleOfferListPage = create(
  require("./example-offer-list-page.scss"), "ExampleOfferListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleOfferListPage");

    const [query, , setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [[hitOffers, hitSize]] = useSuspenseResponse("fetchExampleOffers", {...calcOffsetSpec(query.page, 20)}, {keepPreviousData: true});

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    return (
      <Page title={trans("title")} headerNode={<Header/>} {...rest}>
        <MainContainer>
          <h2 styleName="heading">{trans("heading")}</h2>
          <ExampleOfferList offers={hitOffers} pageSpec={{size: 20, hitSize, page: query.page, onPageSet: handlePageSet}} headerType="date" showExamples={true}/>
        </MainContainer>
      </Page>
    );

  }
);


function serializeQuery(query: ExampleOfferQuery): Search {
  const search = new URLSearchParams();
  search.set("page", query.page.toString());
  return search;
}

function deserializeQuery(search: Search): ExampleOfferQuery {
  const page = (search.get("page") !== null) ? +search.get("page")! : 0;
  return {page};
}

type ExampleOfferQuery = {page: number};