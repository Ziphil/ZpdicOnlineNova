//

import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useLogout,
  usePath,
  useTrans
} from "/client/component/hook";


const DashboardButtonForm = create(
  require("./dashboard-button-form.scss"), "DashboardButtonForm",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("dashboardButtonForm");
    const {pushPath} = usePath();
    const logout = useLogout();

    const performLogout = useCallback(async function (): Promise<void> {
      const response = await logout();
      if (response.status === 200) {
        pushPath("/");
      }
    }, [pushPath, logout]);

    const jumpDashboard = useCallback(async function (): Promise<void> {
      pushPath("/dashboard");
    }, [pushPath]);

    const node = (
      <form styleName="root">
        <div styleName="row">
          <Button label={trans("dashboard")} iconName="house-user" scheme="blue" onClick={jumpDashboard}/>
        </div>
        <div styleName="row">
          <Button label={trans("logout")} iconName="sign-out-alt" variant="simple" onClick={performLogout}/>
        </div>
      </form>
    );
    return node;

  }
);


export default DashboardButtonForm;