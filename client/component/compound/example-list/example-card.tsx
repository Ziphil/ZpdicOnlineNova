/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faHandPointRight, faHashtag, faShare, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {useHref} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, LoadingIcon, MultiLineText, aria, useResponsiveDevice, useTrans} from "zographia";
import {ExampleOfferTag} from "/client/component/atom/example-offer-tag";
import {Link} from "/client/component/atom/link";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {ShareMenu} from "/client/component/compound/share-menu";
import {create} from "/client/component/create";
import {useFilledExample} from "/client/hook/example";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Example} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
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

    const {trans, transNumber} = useTrans("exampleList");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const device = useResponsiveDevice();

    const debug = location.hostname === "localhost";
    const shareText = `${example.sentence} — ${example.translation}\n#ZpDIC`;
    const shareUrl = location.origin + useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}?kind=exact&number=${example.number}`);

    const filledExample = useFilledExample(dictionary, example);

    const discardExample = useDiscardExample(dictionary, example);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {(debug || example.offer !== undefined) && (
            <div styleName="tag">
              {(debug) && (
                <span styleName="number">
                  <GeneralIcon styleName="number-icon" icon={faHashtag}/>
                  {transNumber(example.number)}
                </span>
              )}
              {(example.offer !== undefined) && (
                <ExampleOfferTag offer={{id: example.offer}}/>
              )}
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
          {(!!filledExample.supplement) && (
            <MultiLineText styleName="supplement" is="p">
              {filledExample.supplement}
            </MultiLineText>
          )}
          {(filledExample.words.length > 0) && (
            <div styleName="word">
              <span styleName="icon" {...aria({hidden: true})}>
                <FontAwesomeIcon icon={faHandPointRight}/>
              </span>
              <MultiLineText styleName="text" is="span">
                {filledExample.words.map((word, index) => (
                  <Fragment key={index}>
                    {(index > 0) && <span styleName="punctuation">, </span>}
                    <Link href={`/dictionary/${getDictionaryIdentifier(dictionary)}?kind=exact&number=${word.number}`} scheme="secondary" variant="underline">
                      {word.name ?? <LoadingIcon/>}
                    </Link>
                  </Fragment>
                ))}
              </MultiLineText>
            </div>
          )}
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <div styleName="footer-left">
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
            </div>
            <div styleName="footer-right">
              <ShareMenu text={shareText} url={shareUrl} trigger={(device === "desktop") ? (
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faShare}/></ButtonIconbag>
                  {trans("button.share")}
                </Button>
              ) : (
                <Button scheme="secondary" variant="underline">
                  <GeneralIcon icon={faShare}/>
                </Button>
              )}/>
            </div>
          </CardFooter>
        )}
      </Card>
    );

  }
);