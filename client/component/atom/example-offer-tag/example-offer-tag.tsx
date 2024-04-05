/* eslint-disable no-useless-computed-key */

import dayjs from "dayjs";
import {ReactElement} from "react";
import {LoadingIcon, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {ExampleOffer, ObjectId} from "/client/skeleton";


export const ExampleOfferTag = create(
  null, "ExampleOfferTag",
  function ({
    offer,
    variant,
    ...rest
  }: {
    offer: ExampleOffer | {id: ObjectId},
    variant?: "solid" | "light",
    className?: string
  }): ReactElement | null {

    const {trans, transDate} = useTrans("exampleOfferTag");

    const [innerOffer] = useResponse("fetchExampleOffer", (!isFull(offer)) && {id: offer.id});
    const actualOffer = (!isFull(offer)) ? innerOffer : offer;

    return (
      <Tag variant={variant} {...rest}>
        {(actualOffer !== undefined) ? (
          trans(`tag.${actualOffer.position.name}`, {
            number: actualOffer.position.index + 1,
            dateString: transDate(dayjs(actualOffer.createdDate).tz("Asia/Tokyo"), "date")
          })
        ) : (
          <LoadingIcon/>
        )}
      </Tag>
    );

  }
);


function isFull(offer: ExampleOffer | {id: ObjectId}): offer is ExampleOffer {
  return "position" in offer;
}