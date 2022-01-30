//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";


const ChangeUserNameForm = create(
  require("./change-user-name-form.scss"), "ChangeUserNameForm",
  function ({
    currentName,
    onSubmit
  }: {
    currentName: string | undefined,
    onSubmit?: () => void
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Fragment>
        <form styleName="root">
          <Input label={trans("changeUserNameForm.name")} value={currentName} disabled={true}/>
          <Button label={trans("changeUserNameForm.confirm")} disabled={true}/>
        </form>
        <p styleName="caution">
          {trans("changeUserNameForm.caution")}
        </p>
      </Fragment>
    );
    return node;

  }
);


export default ChangeUserNameForm;