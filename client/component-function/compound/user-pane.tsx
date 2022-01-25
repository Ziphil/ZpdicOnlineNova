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
import Alert from "/client/component-function/atom/alert";
import Button from "/client/component-function/atom/button";
import WhitePane from "/client/component-function/compound/white-pane";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  User
} from "/client/skeleton/user";


const UserPane = create(
  require("./user-pane.scss"), "UserPane",
  function ({
    user,
    dictionary,
    onSubmit
  }: {
    user: User,
    dictionary?: Dictionary,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [alertOpen, setAlertOpen] = useState(false);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let discardAuthorizedUser = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      if (dictionary !== undefined) {
        let number = dictionary.number;
        let id = user.id;
        let response = await request("discardDictionaryAuthorizedUser", {number, id});
        if (response.status === 200) {
          addInformationPopup("dictionaryAuthorizedUserDiscarded");
          await onSubmit?.(event);
        }
      }
    }, [dictionary, user, request, onSubmit, addInformationPopup]);

    let node = (
      <Fragment>
        <WhitePane clickable={false}>
          <div>
            <div styleName="head">
              <div styleName="right">
                <div styleName="image"/>
              </div>
              <div styleName="left">
                <div styleName="screen-name">{user.screenName}</div>
                <div styleName="name">@{user.name}</div>
              </div>
            </div>
          </div>
          <div styleName="setting">
            <Button label={trans("userPane.discard")} iconLabel="&#xF05E;" style="caution" reactive={true} onClick={() => setAlertOpen(true)}/>
          </div>
        </WhitePane>
        <Alert
          text={trans("userPane.alert")}
          confirmLabel={trans("userPane.discard")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardAuthorizedUser}
        />
      </Fragment>
    );
    return node;

  }
);


export default UserPane;