/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {create} from "/client/component/create";
import {EnhancedDictionary, ExampleOffer} from "/client/skeleton";


export const ExampleOfferCard = create(
  require("./example-offer-card.scss"), "ExampleOfferCard",
  function ({
    dictionary,
    offer,
    ...rest
  }: {
    dictionary?: EnhancedDictionary,
    offer: ExampleOffer,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("exampleOfferList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="date">
            <time dateTime={dayjs(offer.createdDate).toISOString()}>{transDate(offer.createdDate, "date")}</time>
          </div>
          <MultiLineText styleName="translation" is="p">
            {offer.translation}
          </MultiLineText>
        </CardBody>
        {(dictionary !== undefined) && (
          <CardFooter styleName="footer">
            <EditExampleDialog dictionary={dictionary} initialData={{type: "offer", offer}} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                {trans("button.add")}
              </Button>
            )}/>
          </CardFooter>
        )}
      </Card>
    );

  }
);