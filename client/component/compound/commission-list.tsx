//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import CommissionPane from "/client/component/compound/commission-pane";
import PaneList from "/client/component/compound/pane-list";
import {
  create
} from "/client/component/create";
import {
  Commission
} from "/client/skeleton/commission";
import {
  EditableWord,
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


const CommissionList = create(
  require("./commission-list.scss"), "CommissionList",
  function ({
    dictionary,
    commissions,
    size,
    onDiscardConfirm,
    onAddConfirm
  }: {
    dictionary: EnhancedDictionary,
    commissions: Array<Commission> | CommissionProvider | null,
    size: number,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onAddConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let renderCommission = useCallback(function (commission: Commission): ReactNode {
      let node = (
        <CommissionPane
          commission={commission}
          dictionary={dictionary}
          key={commission.id}
          onDiscardConfirm={onDiscardConfirm}
          onAddConfirm={onAddConfirm}
        />
      );
      return node;
    }, [dictionary, onDiscardConfirm, onAddConfirm]);

    let node = (
      <Fragment>
        <div styleName="normal">
          <PaneList items={commissions} size={size} column={3} method="table" style="spaced" border={true} renderer={renderCommission}/>
        </div>
        <div styleName="smartphone">
          <PaneList items={commissions} size={size} column={2} method="table" style="spaced" border={true} renderer={renderCommission}/>
        </div>
      </Fragment>
    );
    return node;

  }
);


export type CommissionProvider = (offset?: number, size?: number) => Promise<WithSize<Commission>>;

export default CommissionList;