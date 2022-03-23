//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useLogout,
  usePath
} from "/client/component/hook";


const DashboardButtonForm = create(
  require("./dashboard-button-form.scss"), "DashboardButtonForm",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();
    let {pushPath} = usePath();
    let logout = useLogout();

    let performLogout = useCallback(async function (): Promise<void> {
      let response = await logout();
      if (response.status === 200) {
        pushPath("/");
      }
    }, [pushPath, logout]);

    let jumpDashboard = useCallback(async function (): Promise<void> {
      pushPath("/dashboard");
    }, [pushPath]);

    let node = (
      <form styleName="root">
        <div styleName="row">
          <Button label={trans("dashboardButtonForm.dashboard")} iconName="house-user" variant="information" onClick={jumpDashboard}/>
        </div>
        <div styleName="row">
          <Button label={trans("dashboardButtonForm.logout")} iconName="sign-out-alt" variant="simple" onClick={performLogout}/>
        </div>
      </form>
    );
    return node;

  }
);


export default DashboardButtonForm;