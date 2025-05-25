/* eslint-disable react/jsx-closing-bracket-location */

import {faCommentQuestion} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useState} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {AddProposalDialog} from "/client/component/compound/add-proposal-dialog";
import {ProposalList} from "/client/component/compound/proposal-list";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useSuspenseResponse} from "/client/hook/request";
import {calcOffsetSpec} from "/client/util/misc";


export const DictionaryProposalPart = create(
  require("./dictionary-proposal-part.scss"), "DictionaryProposalPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryProposalPart");

    const dictionary = useDictionary();

    const [page, setPage] = useState(0);
    const [[hitProposals, hitSize]] = useSuspenseResponse("fetchProposals", {number: dictionary.number, ...calcOffsetSpec(page, 50)}, {keepPreviousData: true});

    return (
      <div styleName="root" {...rest}>
        <div styleName="list-container">
          <AddProposalDialog dictionary={dictionary} trigger={(
            <Button styleName="button" variant="light">
              <ButtonIconbag><GeneralIcon icon={faCommentQuestion}/></ButtonIconbag>
              {trans("button.addProposal")}
            </Button>
          )}/>
          <ProposalList dictionary={dictionary} proposals={hitProposals} pageSpec={{size: 50, hitSize, page, onPageSet: setPage}}/>
        </div>
      </div>
    );

  }
);