/* eslint-disable no-useless-computed-key */

import {faTriangleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {GeneralIcon, LeveledColorScheme, LoadingIcon, Tag, useTrans} from "zographia";
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
    offer: ExampleOffer | LinkedExampleOffer | null | undefined,
    className?: string
  }): ReactElement | null {

    const {trans, transNumber, transDate} = useTrans("exampleOfferTag");

    const [innerOffer] = useResponse("fetchExampleOfferOrNull", (needResponse(offer)) && offer);
    const actualOffer = (needResponse(offer)) ? innerOffer : offer;

    return (
      <span styleName="root" {...rest}>
        <Tag scheme={scheme} variant={variant}>
          {(actualOffer !== undefined && actualOffer !== null) ? (
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
            (actualOffer === undefined) ? <LoadingIcon/> : <GeneralIcon icon={faTriangleExclamation}/>
          )}
        </Tag>
      </span>
    );

  }
);


function needResponse(offer: ExampleOffer | LinkedExampleOffer | undefined | null): offer is LinkedExampleOffer {
  return !!offer && !("id" in offer);
}