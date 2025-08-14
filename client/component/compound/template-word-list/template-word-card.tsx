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
            {word.sections.map((section, index) => (
              <li styleName="count-item" key={index}>
                {"["}
                {(section.equivalents.length > 0) && <span styleName="count-section-item">{trans("label.equivalent", {count: section.equivalents.length})}</span>}
                {(section.informations.length > 0) && <span styleName="count-section-item">{trans("label.information", {count: section.informations.length})}</span>}
                {(section.phrases.length > 0) && <span styleName="count-section-item">{trans("label.phrase", {count: section.phrases.length})}</span>}
                {(section.variations.length > 0) && <span styleName="count-section-item">{trans("label.variation", {count: section.variations.length})}</span>}
                {(section.relations.length > 0) && <span styleName="count-section-item">{trans("label.relation", {count: section.relations.length})}</span>}
                {"]"}
              </li>
            ))}
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