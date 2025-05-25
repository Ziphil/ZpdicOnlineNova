/* eslint-disable react/jsx-closing-bracket-location */

import {faCreativeCommonsZero} from "@fortawesome/free-brands-svg-icons";
import {faCheck, faCopyright, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement, useCallback, useMemo} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, Link, LinkIconbag, MultiLineText, data, useTrans} from "zographia";
import {ExampleOfferTag} from "/client/component/atom/example-offer-tag";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {ExampleOfferCardExampleItem} from "/client/component/compound/example-offer-list/example-offer-card-example-item";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, ExampleOffer} from "/client/skeleton";


export const ExampleOfferCard = create(
  require("./example-offer-card.scss"), "ExampleOfferCard",
  function ({
    dictionary,
    offer,
    headerType,
    showSupplement,
    showExamples,
    showSelectButton,
    onSelect,
    ...rest
  }: {
    dictionary?: DictionaryWithExecutors,
    offer: ExampleOffer,
    headerType: "tag" | "date",
    showSupplement: boolean,
    showExamples: boolean,
    showSelectButton: boolean,
    onSelect?: (offer: ExampleOffer) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("exampleOfferList");

    const [[examples] = []] = useResponse("fetchAllExamplesByOffer", (showExamples) && {offer});
    const displayedExamples = useMemo(() => examples?.filter((example) => !!example.sentence), [examples]);

    const zonedCreatedDate = dayjs(offer.createdDate).tz("Asia/Tokyo");

    const handleSelect = useCallback(function (): void {
      onSelect?.(offer);
    }, [onSelect, offer]);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="top">
            {(headerType === "tag") ? (
              <div styleName="header">
                <ExampleOfferTag offer={offer} scheme="primary" variant="solid"/>
                {offer.catalog === "zpdicDaily" ? (
                  <Link styleName="author" href={"/document/other/exmaple-offer-licence"} scheme="gray" variant="simple">
                    <LinkIconbag><GeneralIcon styleName="author-icon" icon={faCreativeCommonsZero}/></LinkIconbag>
                    CC0 ({offer.author})
                  </Link>
                ) : (
                  <Link styleName="author" href={"/document/other/exmaple-offer-licence"} scheme="gray" variant="simple">
                    <LinkIconbag><GeneralIcon styleName="author-icon" icon={faCopyright}/></LinkIconbag>
                    {offer.author}
                  </Link>
                )}
              </div>
            ) : (
              <div styleName="date">
                <time dateTime={zonedCreatedDate.format("YYYY-MM-DD")}>{transDate(zonedCreatedDate, "date")}</time>
              </div>
            )}
            <MultiLineText styleName="translation" is="p" {...data({large: showExamples})}>
              {offer.translation}
            </MultiLineText>
            {(offer.supplement && showSupplement) && (
              <MultiLineText styleName="supplement" is="p">
                {offer.supplement}
              </MultiLineText>
            )}
          </div>
          {(displayedExamples !== undefined && displayedExamples.length > 0) && (
            <ul styleName="list">
              {displayedExamples.map((example) => (
                <ExampleOfferCardExampleItem key={example.id} example={example}/>
              ))}
            </ul>
          )}
        </CardBody>
        {(dictionary !== undefined || showSelectButton) && (
          <CardFooter styleName="footer">
            {(dictionary !== undefined) && (
              <EditExampleDialog dictionary={dictionary} initialData={{type: "offer", offer}} trigger={(
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                  {trans("button.add")}
                </Button>
              )}/>
            )}
            {(showSelectButton) && (
              <Button scheme="secondary" variant="underline" onClick={handleSelect}>
                <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                {trans("button.select")}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );

  }
);