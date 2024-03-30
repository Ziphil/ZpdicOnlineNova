/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, useCallback, useState} from "react";
import {AdditionalProps, SingleLineText, useTrans} from "zographia";
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

    const [page, setPage] = useState(0);
    const [[hitExamples, hitSize]] = useSuspenseResponse("fetchExamples", {number: dictionary.number, ...calcOffsetSpec(page, 40)}, {keepPreviousData: true});

    const [[offers] = []] = useResponse("fetchExampleOffers", {size: 1, offset: 0});

    const handlePageSet = useCallback(function (page: number): void {
      setPage(page);
      window.scrollTo(0, 0);
    }, []);

    return (
      <div styleName="root" {...rest}>
        <div styleName="left">
          <div styleName="sticky">
            <SearchExampleForm styleName="form"/>
            {(offers !== undefined) && (
              <section>
                <SingleLineText styleName="heading" is="h3">
                  {trans("heading.offer")}
                </SingleLineText>
                <ExampleOfferList dictionary={dictionary} offers={offers} showPagination={false} pageSpec={{size: 1}}/>
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
