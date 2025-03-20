/* eslint-disable react/jsx-closing-bracket-location */

import {faCommentQuestion} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useState} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {AddCommissionDialog} from "/client/component/compound/add-commission-dialog";
import {CommissionList} from "/client/component/compound/commission-list";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useSuspenseResponse} from "/client/hook/request";
import {calcOffsetSpec} from "/client/util/misc";


export const DictionaryCommissionPart = create(
  require("./dictionary-commission-part.scss"), "DictionaryCommissionPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryCommissionPart");

    const dictionary = useDictionary();

    const [page, setPage] = useState(0);
    const [[hitCommissions, hitSize]] = useSuspenseResponse("fetchCommissions", {number: dictionary.number, ...calcOffsetSpec(page, 50)}, {keepPreviousData: true});

    return (
      <div styleName="root" {...rest}>
        <div styleName="list-container">
          <AddCommissionDialog dictionary={dictionary} trigger={(
            <Button styleName="button" variant="light">
              <ButtonIconbag><GeneralIcon icon={faCommentQuestion}/></ButtonIconbag>
              {trans("button.addCommission")}
            </Button>
          )}/>
          <CommissionList dictionary={dictionary} commissions={hitCommissions} pageSpec={{size: 50, hitSize, page, onPageSet: setPage}}/>
        </div>
      </div>
    );

  }
);