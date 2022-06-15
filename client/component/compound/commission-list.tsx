//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import CommissionPane from "/client/component/compound/commission-pane";
import PaneList from "/client/component/compound/pane-list-beta";
import {
  create
} from "/client/component/create";
import {
  useSuspenseQuery
} from "/client/component/hook";
import {
  useMediaQuery
} from "/client/component/hook/media-query";
import {
  Commission
} from "/client/skeleton/commission";
import {
  EditableWord,
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  calcOffset
} from "/client/util/misc";
import {
  WithSize
} from "/server/controller/internal/type";


const CommissionList = create(
  require("./commission-list.scss"), "CommissionList",
  function ({
    dictionary,
    size,
    onDiscardConfirm,
    onAddConfirm
  }: {
    dictionary: EnhancedDictionary,
    size: number,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>,
    onAddConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
  }): ReactElement {

    const {smartphone} = useMediaQuery();

    const [page, setPage] = useState(0);
    const number = dictionary.number;
    const [[hitCommissions, hitSize]] = useSuspenseQuery("fetchCommissions", {number, ...calcOffset(page, size)}, {keepPreviousData: true});

    const column = (smartphone) ? 2 : 3;
    const node = (
      <div styleName="root">
        <PaneList
          items={hitCommissions}
          column={column}
          size={size}
          hitSize={hitSize}
          page={page}
          onPageSet={setPage}
          renderer={(commission) => (
            <CommissionPane
              key={commission.id}
              dictionary={dictionary}
              commission={commission}
              onDiscardConfirm={onDiscardConfirm}
              onAddConfirm={onAddConfirm}
            />
          )}
        />
      </div>
    );
    return node;

  }
);


export type CommissionProvider = (offset?: number, size?: number) => Promise<WithSize<Commission>>;

export default CommissionList;