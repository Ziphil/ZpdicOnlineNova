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
import WhitePane from "/client/component/compound/white-pane";
import {
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

    const [alertOpen, setAlertOpen] = useState(false);
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const discardAuthorizedUser = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      if (dictionary !== undefined) {
        const number = dictionary.number;
        const id = user.id;
        const response = await request("discardDictionaryAuthorizedUser", {number, id});
        if (response.status === 200) {
          addInformationPopup("dictionaryAuthorizedUserDiscarded");
          await onSubmit?.(event);
          await invalidateQueries("fetchDictionaryAuthorizedUsers", (data) => data.number === number);
        }
      }
    }, [dictionary, user, request, onSubmit, addInformationPopup]);

    const node = (
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
            <Button label={trans("userPane.discard")} iconName="ban" scheme="red" reactive={true} onClick={() => setAlertOpen(true)}/>
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