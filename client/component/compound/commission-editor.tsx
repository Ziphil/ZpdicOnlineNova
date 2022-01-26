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

    let [name, setName] = useState("");
    let [comment, setComment] = useState("");
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let addCommission = useCallback(async function (event: MouseEvent<HTMLElement>): Promise<void> {
      let number = dictionary.number;
      let response = await request("addCommission", {number, name, comment}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("commissionAdded");
        onClose?.(event);
      }
    }, [dictionary.number, name, comment, request, onClose, addInformationPopup]);

    let node = (
      <Overlay size="large" title={trans("commissionEditor.title")} open={open} onClose={onClose}>
        <div styleName="root">
          <Input label={trans("commissionEditor.name")} value={name} onSet={(name) => setName(name)}/>
          <TextArea className={styles!["comment"]} label={trans("commissionEditor.comment")} value={comment} showOptional={true} onSet={(comment) => setComment(comment)}/>
          <Button className={styles!["button"]} label={trans("commissionEditor.confirm")} iconName="list-alt" style="information" reactive={true} onClick={addCommission}/>
        </div>
      </Overlay>
    );
    return node;

  }
);


export default CommissionEditor;