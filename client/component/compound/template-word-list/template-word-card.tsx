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
  SingleLineText,
  useTrans
} from "zographia";
import {EditTemplateWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, TemplateWord} from "/server/internal/skeleton";
import {useDiscardTemplateWord} from "./template-word-card-hook";

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

    const {trans} = useTrans("templateWordList");

    const [authorities] = useResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    const discardWord = useDiscardTemplateWord(dictionary, word);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <SingleLineText styleName="title">
            {word.title}
          </SingleLineText>
          <ul styleName="count-list">
            {(word.equivalents.length > 0) && <li>{trans("label.equivalent", {count: word.equivalents.length})}</li>}
            {(word.informations.length > 0) && <li>{trans("label.information", {count: word.informations.length})}</li>}
            {(word.phrases.length > 0) && <li>{trans("label.phrase", {count: word.phrases.length})}</li>}
            {(word.variations.length > 0) && <li>{trans("label.variation", {count: word.variations.length})}</li>}
            {(word.relations.length > 0) && <li>{trans("label.relation", {count: word.relations.length})}</li>}
          </ul>
        </CardBody>
        {(authorities?.includes("own")) && (
          <CardFooter styleName="footer">
            <EditTemplateWordDialog dictionary={dictionary} initialData={{type: "word", word}} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                {trans("button.edit")}
              </Button>
            )}/>
            <Button scheme="red" variant="underline" onClick={discardWord}>
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);