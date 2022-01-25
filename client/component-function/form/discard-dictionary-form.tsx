//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import Alert from "/client/component-function/atom/alert";
import Button from "/client/component-function/atom/button";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";


const DiscardDictionaryForm = create(
  require("./discard-dictionary-form.scss"), "DiscardDictionaryForm",
  function ({
    number,
    onSubmit
  }: {
    number: number,
    onSubmit?: () => void
  }): ReactElement {

    let [alertOpen, setAlertOpen] = useState(false);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let discardDictionary = useCallback(async function (): Promise<void> {
      let response = await request("discardDictionary", {number});
      if (response.status === 200) {
        addInformationPopup("dictionaryDiscarded");
        onSubmit?.();
      }
    }, [number, request, onSubmit, addInformationPopup]);

    let node = (
      <Fragment>
        <form styleName="root">
          <Button label={trans("discardDictionaryForm.confirm")} reactive={true} style="caution" onClick={() => setAlertOpen(true)}/>
        </form>
        <p styleName="caution">
          {trans("discardDictionaryForm.caution")}
        </p>
        <Alert
          text={trans("discardDictionaryForm.alert")}
          confirmLabel={trans("discardDictionaryForm.confirm")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardDictionary}
        />
      </Fragment>
    );
    return node;

  }
);


export default DiscardDictionaryForm;