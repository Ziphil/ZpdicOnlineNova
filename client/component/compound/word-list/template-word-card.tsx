/* eslint-disable react/jsx-closing-bracket-location */

import {faEdit, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  Card,
  CardBody,
  CardFooter,
  GeneralIcon,
  useTrans
} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, TemplateWord} from "/client/skeleton";
import {WordCardEquivalentList} from "./word-card-equivalent-list";
import {WordCardHeading} from "./word-card-heading";
import {WordCardInformationList} from "./word-card-information-list";
import {WordCardRelationList} from "./word-card-relation-list";
import {WordCardVariationList} from "./word-card-variation-list";


export const TemplateWordCard = create(
  require("./template-word-card.scss"), "TemplateWordCard",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: TemplateWord,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("wordList");

    const [authorities] = useResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <WordCardHeading dictionary={dictionary} word={word}/>
          <WordCardEquivalentList dictionary={dictionary} word={word}/>
          <WordCardInformationList dictionary={dictionary} word={word}/>
          <WordCardVariationList dictionary={dictionary} word={word}/>
          <WordCardRelationList dictionary={dictionary} word={word}/>
        </CardBody>
        {(authorities?.includes("own")) && (
          <CardFooter styleName="footer">
            <div styleName="footer-left">
              <EditWordDialog dictionary={dictionary} initialData={null} trigger={(
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                  {trans("button.edit")}
                </Button>
              )}/>
              <Button scheme="red" variant="underline" onClick={undefined}>
                <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
                {trans("button.discard")}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );

  }
);