/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faHandPointRight, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, LoadingIcon, MultiLineText, aria, useTrans} from "zographia";
import {ExampleOfferTag} from "/client/component/atom/example-offer-tag";
import {Link} from "/client/component/atom/link";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {create} from "/client/component/create";
import {useFilledExample} from "/client/hook/example";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Example} from "/client/skeleton";
import {useDiscardExample} from "./example-card-hook";


export const ExampleCard = create(
  require("./example-card.scss"), "ExampleCard",
  function ({
    dictionary,
    example,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    example: Example,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleList");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});
    const [offer] = useResponse("fetchExampleOffer", (example.offer !== undefined) && {id: example.offer});

    const filledExample = useFilledExample(dictionary, example);

    const discardExample = useDiscardExample(dictionary, example);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {(offer !== undefined) && (
            <div styleName="tag">
              <ExampleOfferTag variant="solid" offer={offer}/>
            </div>
          )}
          <div styleName="parallel">
            <MultiLineText is="p">
              {filledExample.sentence}
            </MultiLineText>
            <MultiLineText is="p">
              {filledExample.translation}
            </MultiLineText>
          </div>
          <div styleName="word">
            <span styleName="icon" {...aria({hidden: true})}>
              <FontAwesomeIcon icon={faHandPointRight}/>
            </span>
            <MultiLineText styleName="text" is="span">
              {(filledExample.words.length > 0) ? filledExample.words.map((word, index) => (
                <Fragment key={index}>
                  {(index > 0) && <span styleName="punctuation">, </span>}
                  <Link href={`/dictionary/${dictionary.number}?text=${encodeURIComponent(word.name ?? "")}&mode=name&type=exact&page=0`} scheme="secondary" variant="underline">
                    {word.name ?? <LoadingIcon/>}
                  </Link>
                </Fragment>
              )) : (
                <p styleName="absent">
                  {trans("noWord")}
                </p>
              )}
            </MultiLineText>
          </div>
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <EditExampleDialog dictionary={dictionary} initialData={{type: "example", example: filledExample}} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                {trans("button.edit")}
              </Button>
            )}/>
            <Button scheme="red" variant="underline" onClick={discardExample}>
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);