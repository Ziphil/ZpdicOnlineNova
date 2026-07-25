//

import {ReactElement, useCallback, useState} from "react";
import {AdditionalProps} from "zographia";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {SearchExampleOfferForm} from "/client/component/compound/search-example-offer-form";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {calcOffsetSpec} from "/client/util/misc";
import {DictionaryWithExecutors, ExampleOffer, ExampleOfferParameter, NormalExampleOfferParameter} from "/server/internal/skeleton";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormOfferPart = create(
  require("./edit-example-form-offer-part.scss"), "EditExampleFormOfferPart",
  function ({
    dictionary,
    formSpec,
    setTabValue,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditExampleSpec,
    setTabValue: (value: "edit" | "offer") => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {form} = formSpec;

    const [query, setQuery] = useState<ExampleOfferQuery>({parameter: NormalExampleOfferParameter.DAILY, page: 0});
    const [[offers, hitSize] = []] = useResponse("searchExampleOffers", {parameter: query.parameter, ...calcOffsetSpec(query.page, 50)}, {keepPreviousData: true});

    const handleParameterCommit = useCallback(function (parameter: ExampleOfferParameter): void {
      setQuery({parameter, page: 0});
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
    }, [query, setQuery]);

    const handleSelect = useCallback(function (offer: ExampleOffer): void {
      form.setValue("offer", {catalog: offer.catalog, number: offer.number});
      form.setValue("translation", offer.translation);
      setTabValue("edit");
    }, [form, setTabValue]);

    return (
      <div styleName="root" {...rest}>
        <SearchExampleOfferForm parameter={query.parameter} onParameterCommit={handleParameterCommit}/>
        <ExampleOfferList offers={offers} pageSpec={{size: 50, hitSize, page: query.page, onPageSet: handlePageSet}} showSupplement={true} showSelectButton={true} onSelect={handleSelect}/>
      </div>
    );

  }
);


export type ExampleOfferQuery = {parameter: ExampleOfferParameter, page: number};