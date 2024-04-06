//

import {ReactElement, SetStateAction, useCallback, useState} from "react";
import {AdditionalProps} from "zographia";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {SearchExampleOfferForm} from "/client/component/compound/search-example-offer-form";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, ExampleOffer, ExampleOfferParameter, NormalExampleOfferParameter} from "/client/skeleton";
import {calcOffsetSpec, resolveStateAction} from "/client/util/misc";
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
    const [[offers, hitSize] = []] = useResponse("searchExampleOffers", {parameter: query.parameter, ...calcOffsetSpec(query.page, 20)}, {keepPreviousData: true});

    const handleParameterSet = useCallback(function (parameter: SetStateAction<ExampleOfferParameter>): void {
      setQuery((prevQuery) => {
        const nextParameter = resolveStateAction(parameter, prevQuery.parameter);
        return {parameter: nextParameter, page: 0};
      });
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
    }, [query, setQuery]);

    const handleSelect = useCallback(function (offer: ExampleOffer): void {
      form.setValue("offer", offer.id);
      form.setValue("translation", offer.translation);
      setTabValue("edit");
    }, [form, setTabValue]);

    return (
      <div styleName="root" {...rest}>
        <SearchExampleOfferForm parameter={query.parameter} onParameterSet={handleParameterSet}/>
        <ExampleOfferList offers={offers} pageSpec={{size: 40, hitSize, page: query.page, onPageSet: handlePageSet}} showSupplement={true} showSelectButton={true} onSelect={handleSelect}/>
      </div>
    );

  }
);


export type ExampleOfferQuery = {parameter: ExampleOfferParameter, page: number};