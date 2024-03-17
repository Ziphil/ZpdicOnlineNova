//

import {ReactElement, useState} from "react";
import {AdditionalProps} from "zographia";
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

    const dictionary = useDictionary();

    const [page, setPage] = useState(0);
    const [[hitCommissions, hitSize]] = useSuspenseResponse("fetchCommissions", {number: dictionary.number, ...calcOffsetSpec(page, 40)}, {keepPreviousData: true});

    return (
      <div styleName="root" {...rest}>
        <CommissionList dictionary={dictionary} commissions={hitCommissions} pageSpec={{size: 40, hitSize, page, onPageSet: setPage}}/>
      </div>
    );

  }
);