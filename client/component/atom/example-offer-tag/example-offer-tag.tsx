/* eslint-disable no-useless-computed-key */

import dayjs from "dayjs";
import {ReactElement} from "react";
import {LeveledColorScheme, LoadingIcon, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {ExampleOffer, ObjectId} from "/client/skeleton";


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
    offer: ExampleOffer | {id: ObjectId},
    className?: string
  }): ReactElement | null {

    const {trans, transNumber, transDate} = useTrans("exampleOfferTag");

    const [innerOffer] = useResponse("fetchExampleOffer", (!isFull(offer)) && {id: offer.id});
    const actualOffer = (!isFull(offer)) ? innerOffer : offer;

    return (
      <span styleName="root" {...rest}>
        <Tag scheme={scheme} variant={variant}>
          {(actualOffer !== undefined) ? (
            <span>
              {trans(`catalog.${actualOffer.catalog}`)}
              {" · "}
              {(actualOffer.catalog === "zpdicDaily") ? (
                transDate(dayjs(actualOffer.createdDate).tz("Asia/Tokyo"), "date")
              ) : (
                <>
                  <span styleName="number">№</span>
                  {transNumber(actualOffer.number)}
                </>
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


function isFull(offer: ExampleOffer | {id: ObjectId}): offer is ExampleOffer {
  return "catalog" in offer;
}