/* eslint-disable react/jsx-closing-bracket-location */

import {faPlus, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, EditableWord, Proposal} from "/client/skeleton";
import {useDiscardProposal} from "./proposal-card-hook";


export const ProposalCard = create(
  require("./proposal-card.scss"), "ProposalCard",
  function ({
    dictionary,
    proposal,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    proposal: Proposal,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("proposalList");

    const word = useMemo(() => getWord(proposal), [proposal]);

    const discardProposal = useDiscardProposal(dictionary, proposal);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <MultiLineText styleName="name">
            {proposal.name}
          </MultiLineText>
          {(!!proposal.comment) && (
            <MultiLineText styleName="comment">
              {proposal.comment}
            </MultiLineText>
          )}
        </CardBody>
        <CardFooter styleName="footer">
          <EditWordDialog dictionary={dictionary} initialData={{type: "word", word}} trigger={(
            <Button scheme="secondary" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
              {trans("button.add")}
            </Button>
          )}/>
          <Button scheme="red" variant="underline" onClick={discardProposal}>
            <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
            {trans("button.discard")}
          </Button>
        </CardFooter>
      </Card>
    );

  }
);


function getWord(proposal: Proposal): EditableWord {
  const word = {
    number: null,
    name: "",
    pronunciation: "",
    equivalents: [{titles: [], names: [proposal.name], nameString: proposal.name}],
    tags: [],
    informations: [{title: "", text: ""}],
    phrases: [],
    variations: [],
    relations: []
  };
  return word;
}