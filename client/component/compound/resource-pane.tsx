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
import WhitePane from "/client/component/compound/white-pane";
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

    const [alertOpen, setAlertOpen] = useState(false);
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const discardResource = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      const number = dictionary.number;
      const name = resource;
      const response = await request("discardResource", {number, name});
      if (response.status === 200) {
        addInformationPopup("resourceDiscarded");
        await onDiscardConfirm?.(event);
      }
    }, [dictionary.number, resource, request, onDiscardConfirm, addInformationPopup]);

    const url = AwsUtil.getFileUrl(`resource/${dictionary.number}/${resource}`);
    const shortUrl = "~" + resource;
    const code = `![](<${shortUrl}>)`;
    const codeNode = (showCode) && (
      <div styleName="code-outer">
        <div styleName="code-wrapper">
          <TextArea value={code} language="plain" font="monospace" fitHeight={true} readOnly={true}/>
        </div>
      </div>
    );
    const node = (
      <Fragment>
        <WhitePane clickable={false}>
          <div>
            <div styleName="resource">{resource}</div>
            {codeNode}
            <div styleName="image">
              <img src={url}/>
            </div>
          </div>
          <div styleName="button">
            <Button label={trans("resourcePane.discard")} iconName="trash-alt" variant="simple" onClick={() => setAlertOpen(true)}/>
          </div>
        </WhitePane>
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