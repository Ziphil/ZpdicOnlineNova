//

import * as react from "react";
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
import TextArea from "/client/component/atom/text-area";
import {
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
import {
  AwsUtil
} from "/client/util/aws";


const ResourcePane = create(
  require("./resource-pane.scss"), "ResourcePane",
  function ({
    dictionary,
    resource,
    showCode = false,
    onDiscardConfirm
  }: {
    dictionary: Dictionary,
    resource: string,
    showCode?: boolean,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [alertOpen, setAlertOpen] = useState(false);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let discardResource = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let name = resource;
      let response = await request("discardResource", {number, name});
      if (response.status === 200) {
        addInformationPopup("resourceDiscarded");
        await onDiscardConfirm?.(event);
      }
    }, [dictionary.number, resource, request, onDiscardConfirm, addInformationPopup]);

    let url = AwsUtil.getFileUrl(`resource/${dictionary.number}/${resource}`);
    let shortUrl = "~" + resource;
    let code = `![](<${shortUrl}>)`;
    let codeNode = (showCode) && (
      <div styleName="code-outer">
        <div styleName="code-wrapper">
          <TextArea value={code} language="plain" font="monospace" fitHeight={true} readOnly={true}/>
        </div>
      </div>
    );
    let node = (
      <Fragment>
        <div styleName="root">
          {resource}
          {codeNode}
          <div styleName="button-wrapper">
            <div styleName="image">
              <img src={url}/>
            </div>
            <div styleName="button">
              <Button label={trans("resourcePane.discard")} iconName="trash-alt" style="simple" onClick={() => setAlertOpen(true)}/>
            </div>
          </div>
        </div>
        <Alert
          text={trans("resourcePane.alert")}
          confirmLabel={trans("resourcePane.discard")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardResource}
        />
      </Fragment>
    );
    return node;

  }
);


export default ResourcePane;