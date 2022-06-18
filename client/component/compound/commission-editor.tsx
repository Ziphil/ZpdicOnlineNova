//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  invalidateQueries,
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  Dictionary
} from "/client/skeleton/dictionary";


const CommissionEditor = create(
  require("./commission-editor.scss"), "CommissionEditor",
  function ({
    dictionary,
    open,
    onClose,
    styles
  }: {
    dictionary: Dictionary,
    open: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const [name, setName] = useState("");
    const [comment, setComment] = useState("");

    const addCommission = useCallback(async function (event: MouseEvent<HTMLElement>): Promise<void> {
      const number = dictionary.number;
      const response = await request("addCommission", {number, name, comment}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("commissionAdded");
        await onClose?.(event);
        await invalidateQueries("fetchCommissions", (data) => data.number === number);
      }
    }, [dictionary.number, name, comment, request, onClose, addInformationPopup]);

    const node = (
      <Overlay size="large" title={trans("commissionEditor.title")} open={open} onClose={onClose}>
        <div styleName="root">
          <Input label={trans("commissionEditor.name")} value={name} onSet={setName}/>
          <TextArea className={styles!["comment"]} label={trans("commissionEditor.comment")} value={comment} showOptional={true} onSet={setComment}/>
          <Button className={styles!["button"]} label={trans("commissionEditor.confirm")} iconName="list-check" scheme="blue" reactive={true} onClick={addCommission}/>
        </div>
      </Overlay>
    );
    return node;

  }
);


export default CommissionEditor;