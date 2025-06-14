/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleEllipsis, faEdit, faHandPointRight, faShare, faTrashAlt, faTriangleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {useHref} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, LoadingIcon, MultiLineText, Tag, aria, useResponsiveDevice, useTrans} from "zographia";
import {ExampleOfferTag} from "/client/component/atom/example-offer-tag";
import {Link} from "/client/component/atom/link";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {ShareMenu} from "/client/component/compound/share-menu";
import {WordPopover} from "/client/component/compound/word-popover";
import {create} from "/client/component/create";
import {useFilledExample} from "/client/hook/example";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Example} from "/client/skeleton";
import {getExampleHref, getWordHref} from "/client/util/dictionary";
import {useDiscardExample} from "./example-card-hook";
import {ExampleCardInfoPopover} from "./example-card-info-popover";


export const ExampleCard = create(
  require("./example-card.scss"), "ExampleCard",
  function ({
    dictionary,
    example,
    showInfo,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    example: Example,
    showInfo: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleList");

    const [authorities] = useResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});
    const [offer] = useResponse("fetchExampleOfferOrNull", (example.offer) && example.offer);

    const device = useResponsiveDevice();

    const shareText = `${example.sentence} — ${example.translation}\n#ZpDIC`;
    const shareUrl = location.origin + useHref(getExampleHref(dictionary, example.number));

    const filledExample = useFilledExample(dictionary, example);

    const discardExample = useDiscardExample(dictionary, example);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {(example.offer !== null || example.tags.length > 0) && (
            <div styleName="tag">
              {(example.offer !== null) && (
                <ExampleOfferTag offer={offer}/>
              )}
              {example.tags.map((tag, index) => (
                <Tag key={index} variant="solid">{tag}</Tag>
              ))}
            </div>
          )}
          <div styleName="parallel">
            <MultiLineText is="p">
              {filledExample.sentence}
            </MultiLineText>
            <MultiLineText is="p">
              {(example.offer !== null) ? offer?.translation : filledExample.translation}
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
                    <WordPopover dictionary={dictionary} word={word} trigger={(
                      <span>
                        <Link href={getWordHref(dictionary, word.number)} scheme="secondary" variant="underline">
                          {(word.name === undefined) ? <LoadingIcon/> : (word.name === null) ? <GeneralIcon icon={faTriangleExclamation}/> : word.name}
                        </Link>
                      </span>
                    )}/>
                  </Fragment>
                ))}
              </MultiLineText>
            </div>
          )}
        </CardBody>
        {(authorities?.includes("edit")) && (
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
              {(showInfo) && (
                <ExampleCardInfoPopover example={example} trigger={(device === "desktop") ? (
                  <Button scheme="secondary" variant="underline">
                    <ButtonIconbag><GeneralIcon icon={faCircleEllipsis}/></ButtonIconbag>
                    {trans("button.info")}
                  </Button>
                ) : (
                  <Button scheme="secondary" variant="underline">
                    <GeneralIcon icon={faCircleEllipsis}/>
                  </Button>
                )}/>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    );

  }
);