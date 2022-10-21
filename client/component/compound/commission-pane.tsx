//

import {
  Fragment,
  MouseEvent,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import WhitePane from "/client/component/compound/white-pane";
import {
  create
} from "/client/component/create";
import {
  invalidateQueries,
  usePopup,
  useRequest,
  useTrans,
  useWordEditor
} from "/client/component/hook";
import {
  Commission
} from "/client/skeleton/commission";
import {
  EditableWord,
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const CommissionPane = create(
  require("./commission-pane.scss"), "CommissionPane",
  function ({
    commission,
    dictionary,
    onDiscardConfirm,
    onAddConfirm
  }: {
    commission: Commission,
    dictionary: EnhancedDictionary,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>,
    onAddConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
  }): ReactElement {

    const [alertOpen, setAlertOpen] = useState(false);
    const addWordEditor = useWordEditor();
    const {trans} = useTrans("commissionPane");
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const discardCommission = useCallback(async function (event: MouseEvent<HTMLButtonElement>, showPopup?: boolean): Promise<void> {
      const number = dictionary.number;
      const id = commission.id;
      const response = await request("discardCommission", {number, id});
      if (response.status === 200) {
        if (showPopup === undefined || showPopup) {
          addInformationPopup("commissionDiscarded");
        }
        await onDiscardConfirm?.(event);
        await invalidateQueries("fetchCommissions", (data) => data.number === number);
      }
    }, [dictionary.number, commission, request, onDiscardConfirm, addInformationPopup]);

    const handleEditConfirm = useCallback(async function (word: EditableWord, event: MouseEvent<HTMLButtonElement>): Promise<void> {
      await discardCommission(event, false);
      await onAddConfirm?.(word, event);
    }, [onAddConfirm, discardCommission]);

    const openEditor = useCallback(function (): void {
      addWordEditor({
        dictionary,
        word: null,
        defaultEquivalentName: commission.name,
        onEditConfirm: handleEditConfirm
      });
    }, [dictionary, commission, handleEditConfirm, addWordEditor]);

    const name = commission.name;
    const comment = commission.comment;
    const node = (
      <Fragment>
        <WhitePane clickable={false}>
          <div>
            <div styleName="name">{name}</div>
            {(comment !== undefined && comment !== "") && (
              <div styleName="comment">
                {comment}
              </div>
            )}
          </div>
          <div styleName="button-container">
            <Button label={trans("discard")} iconName="trash-alt" variant="simple" onClick={() => setAlertOpen(true)}/>
            <Button label={trans("add")} iconName="plus" variant="simple" onClick={openEditor}/>
          </div>
        </WhitePane>
        <Alert
          text={trans("alert")}
          confirmLabel={trans("discard")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardCommission}
        />
      </Fragment>
    );
    return node;

  }
);


export default CommissionPane;