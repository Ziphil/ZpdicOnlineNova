/* eslint-disable no-useless-computed-key */

import dayjs from "dayjs";
import {ReactElement} from "react";
import {LeveledColorScheme, LoadingIcon, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {ExampleOffer, LinkedExampleOffer} from "/client/skeleton";


export const ExampleOfferTag = create(
  require("./example-offer-tag.scss"), "ExampleOfferTag",
  function ({
    scheme = "gray",
    variant = "solid",
    offer,
    ...rest
  }: {
    scheme?: LeveledColorScheme,
    variant?: "solid" | "light",
    offer: ExampleOffer | LinkedExampleOffer | undefined,
    className?: string
  }): ReactElement | null {

    const {trans, transNumber, transDate} = useTrans("exampleOfferTag");

    const [innerOffer] = useResponse("fetchExampleOffer", (!isFull(offer)) && offer);
    const actualOffer = (!isFull(offer)) ? innerOffer : offer;

    return (
      <span styleName="root" {...rest}>
        <Tag scheme={scheme} variant={variant}>
          {(actualOffer !== undefined) ? (
            <span>
              {trans(`catalog.${actualOffer.catalog}`)}
              {" · "}
              <span>
                <span styleName="number">№</span>
                {transNumber(actualOffer.number)}
              </span>
              {(actualOffer.catalog === "zpdicDaily") && (
                <span>
                  {" ("}
                  {transDate(dayjs(actualOffer.createdDate).tz("Asia/Tokyo"), "date")}
                  {")"}
                </span>
              )}
            </span>
          ) : (
            <LoadingIcon/>
          )}
        </Tag>
      </span>
    );

  }
);


function isFull(offer: ExampleOffer | LinkedExampleOffer | undefined): offer is ExampleOffer {
  return offer !== undefined && "id" in offer && "translation" in offer;
}