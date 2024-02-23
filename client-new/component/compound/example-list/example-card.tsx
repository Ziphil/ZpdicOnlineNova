/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faHandPointRight, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, aria, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {EditExampleDialog} from "/client-new/component/compound/edit-example-dialog";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {EnhancedDictionary, Example} from "/client-new/skeleton";
import {useDiscardExample} from "./example-card-hook";


export const ExampleCard = create(
  require("./example-card.scss"), "ExampleCard",
  function ({
    dictionary,
    example,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    example: Example,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("exampleList");

    const number = dictionary.number;
    const wordNumbers = example.words.map((word) => word.number);
    const [canEdit] = useResponse("fetchDictionaryAuthorization", {number, authority: "edit"});
    const [wordNameSpec] = useResponse("fetchWordNames", {number, wordNumbers}, {ignoreError: true});

    const discardExample = useDiscardExample(dictionary, example);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="parallel">
            <MultiLineText is="p">
              {example.sentence}
            </MultiLineText>
            <MultiLineText is="p">
              {example.translation}
            </MultiLineText>
          </div>
          <div styleName="word">
            <span styleName="icon" {...aria({hidden: true})}>
              <FontAwesomeIcon icon={faHandPointRight}/>
            </span>
            <MultiLineText styleName="text" is="span">
              {(example.words.length > 0) ? example.words.map((word, index) => (
                <Fragment key={index}>
                  {(index > 0) && <span styleName="punctuation">, </span>}
                  <Link href={`/dictionary/${dictionary.number}?text=${encodeURIComponent(word.name ?? wordNameSpec?.names[word.number] ?? "")}&mode=name&type=exact&page=0`} scheme="secondary" variant="underline">
                    {word.name ?? wordNameSpec?.names[word.number] ?? "?"}
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
            <EditExampleDialog dictionary={dictionary} example={example} trigger={(
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