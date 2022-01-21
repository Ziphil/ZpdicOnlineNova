//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component-function/atom/button";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  useLogout,
  usePath
} from "/client/component-function/hook";


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
          <Button label={trans("dashboardButtonForm.dashboard")} iconLabel="&#xE065;" style="information" onClick={jumpDashboard}/>
        </div>
        <div styleName="row">
          <Button label={trans("dashboardButtonForm.logout")} iconLabel="&#xF2F5;" style="simple" onClick={performLogout}/>
        </div>
      </form>
    );
    return node;

  }
);


export default DashboardButtonForm;