/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, useCallback, useState} from "react";
import {AdditionalProps, Indicator, SingleLineText, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {ExampleList} from "/client/component/compound/example-list";
import {ExampleOfferList} from "/client/component/compound/example-offer-list";
import {SearchExampleForm} from "/client/component/compound/search-example-form";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useResponse, useSuspenseResponse} from "/client/hook/request";
import {calcOffsetSpec} from "/client/util/misc";


export const DictionaryExamplePart = create(
  require("./dictionary-example-part.scss"), "DictionaryExamplePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryExamplePart");

    const dictionary = useDictionary();

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const [page, setPage] = useState(0);
    const [[hitExamples, hitSize]] = useSuspenseResponse("fetchExamples", {number: dictionary.number, ...calcOffsetSpec(page, 40)}, {keepPreviousData: true});

    const [[offers] = []] = useResponse("fetchExampleOffers", (canEdit) && {size: 1, offset: 0});
    const [[offerExamples] = []] = useResponse("fetchExamplesByOffer", (canEdit && offers !== undefined && offers.length > 0) && {number: dictionary.number, offerId: offers[0].id, size: 1, offset: 0});
    const showOffer = canEdit && offers !== undefined && offerExamples !== undefined && offerExamples.length <= 0;

    const handlePageSet = useCallback(function (page: number): void {
      setPage(page);
      window.scrollTo(0, 0);
    }, []);

    return (
      <div styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="sticky">
            <SearchExampleForm styleName="form"/>
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
          <ExampleList dictionary={dictionary} examples={hitExamples} pageSpec={{size: 40, hitSize, page, onPageSet: handlePageSet}}/>
        </div>
      </div>
    );

  }
);
