/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {ExampleOfferCardExampleItem} from "/client/component/compound/example-offer-list/example-offer-card-example-item";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {EnhancedDictionary, ExampleOffer} from "/client/skeleton";


export const ExampleOfferCard = create(
  require("./example-offer-card.scss"), "ExampleOfferCard",
  function ({
    dictionary,
    offer,
    showExamples,
    ...rest
  }: {
    dictionary?: EnhancedDictionary,
    offer: ExampleOffer,
    showExamples: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("exampleOfferList");

    const [[examples] = []] = useResponse("fetchExamplesByOffer", (showExamples) && {offerId: offer.id});

    const zonedCreatedDate = dayjs(offer.createdDate).tz("Asia/Tokyo");

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="top">
            <div styleName="date">
              <time dateTime={zonedCreatedDate.format("YYYY-MM-DD")}>{transDate(zonedCreatedDate, "date")}</time>
            </div>
            <MultiLineText styleName="translation" is="p">
              {offer.translation}
            </MultiLineText>
          </div>
          {(examples !== undefined) && (
            <ul styleName="list">
              {examples.map((example) => (
                <ExampleOfferCardExampleItem key={example.id} example={example}/>
              ))}
            </ul>
          )}
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