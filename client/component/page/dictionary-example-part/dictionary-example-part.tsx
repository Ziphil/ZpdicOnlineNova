/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, Indicator, LoadingIcon, SingleLineText, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {fakQuotesCirclePlus} from "/client/component/atom/icon";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {ExampleList} from "/client/component/compound/example-list";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {SearchExampleForm} from "/client/component/compound/search-example-form";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useResponse, useSuspenseResponse} from "/client/hook/request";
import {Search, useSearchState} from "/client/hook/search";
import {ExampleParameter, NormalExampleOfferParameter} from "/client/skeleton";
import {calcOffsetSpec, resolveStateAction} from "/client/util/misc";


export const DictionaryExamplePart = create(
  require("./dictionary-example-part.scss"), "DictionaryExamplePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("dictionaryExamplePart");

    const dictionary = useDictionary();

    const [authorities] = useSuspenseResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});
    const canEdit = authorities?.includes("edit");

    const [query, debouncedQuery, setQuery] = useSearchState({serialize: serializeQuery, deserialize: deserializeQuery}, 500);
    const [[hitExamples, hitSize], {isFetching}] = useSuspenseResponse("searchExamples", {number: dictionary.number, parameter: debouncedQuery.parameter, ...calcOffsetSpec(query.page, 50)}, {keepPreviousData: true});

    const [[offers] = []] = useResponse("searchExampleOffers", (canEdit) && {parameter: NormalExampleOfferParameter.DAILY, size: 1, offset: 0});
    const [[offerExamples] = []] = useResponse("fetchExamplesByOffer", (canEdit && offers !== undefined && offers.length > 0) && {number: dictionary.number, offer: offers[0], size: 1, offset: 0});
    const showOffer = canEdit && offers !== undefined && offerExamples !== undefined && offerExamples.length <= 0;

    const handleParameterSet = useCallback(function (parameter: SetStateAction<ExampleParameter>): void {
      setQuery((prevQuery) => {
        const nextParameter = resolveStateAction(parameter, prevQuery.parameter);
        return {parameter: nextParameter, page: 0, showExplanation: false};
      });
    }, [setQuery]);

    const handlePageSet = useCallback(function (page: number): void {
      setQuery({...query, page});
      window.scrollTo(0, 0);
    }, [query, setQuery]);

    return (
      <div styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="sticky">
            <SearchExampleForm styleName="form" parameter={query.parameter} onParameterSet={handleParameterSet}/>
            {(showOffer) && (
              <section styleName="section">
                <SingleLineText styleName="heading" is="h3">
                  {trans("heading.offer")}
                </SingleLineText>
                <Indicator styleName="indicator" scheme="secondary" animate={true}>
                  <ExampleOfferList dictionary={dictionary} offers={offers} headerType="date" showPagination={false} pageSpec={{size: 1}}/>
                </Indicator>
              </section>
            )}
          </div>
        </div>
        <div styleName="right">
          <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
          <div styleName="main">
            <div styleName="header">
              {(canEdit) ? (
                <EditExampleDialog dictionary={dictionary} initialData={null} trigger={(
                  <Button variant="light">
                    <ButtonIconbag><GeneralIcon icon={fakQuotesCirclePlus}/></ButtonIconbag>
                    {trans("button.addExample")}
                  </Button>
                )}/>
              ) : (
                <div/>
              )}
              <div styleName="size">
                {(isFetching) ? <LoadingIcon/> : transNumber(hitSize)}
              </div>
            </div>
            <ExampleList dictionary={dictionary} examples={hitExamples} pageSpec={{size: 50, hitSize, page: query.page, onPageSet: handlePageSet}} showInfo={true}/>
          </div>
        </div>
      </div>
    );

  }
);


function serializeQuery(query: ExampleQuery): Search {
  const search = ExampleParameter.serialize(query.parameter);
  search.set("page", query.page.toString());
  return search;
}

function deserializeQuery(search: Search): ExampleQuery {
  const parameter = ExampleParameter.deserialize(search);
  const page = (search.get("page") !== null) ? +search.get("page")! : 0;
  return {parameter, page};
}

export type ExampleQuery = {parameter: ExampleParameter, page: number};