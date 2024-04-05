/* eslint-disable no-useless-computed-key */

import dayjs from "dayjs";
import {ReactElement} from "react";
import {LoadingIcon, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {ExampleOffer, ObjectId} from "/client/skeleton";


export const ExampleOfferTag = create(
  require("./example-offer-tag.scss"), "ExampleOfferTag",
  function ({
    offer,
    ...rest
  }: {
    offer: ExampleOffer | {id: ObjectId},
    className?: string
  }): ReactElement | null {

    const {trans, transNumber, transDate} = useTrans("exampleOfferTag");

    const [innerOffer] = useResponse("fetchExampleOffer", (!isFull(offer)) && {id: offer.id});
    const actualOffer = (!isFull(offer)) ? innerOffer : offer;

    return (
      <span styleName="root" {...rest}>
        {(actualOffer !== undefined) ? (
          <>
            <Tag variant="solid">
              {trans(`name.${actualOffer.position.name}`)}
            </Tag>
            <Tag variant="light">
              {(actualOffer.position.name === "zpdicDaily") ? (
                transDate(dayjs(actualOffer.createdDate).tz("Asia/Tokyo"), "date")
              ) : (
                trans("number", {number: actualOffer.position.index + 1})
              )}
            </Tag>
          </>
        ) : (
          <Tag variant="solid">
            <LoadingIcon/>
          </Tag>
        )}
      </span>
    );

  }
);


function isFull(offer: ExampleOffer | {id: ObjectId}): offer is ExampleOffer {
  return "position" in offer;
}