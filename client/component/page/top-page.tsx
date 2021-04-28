//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import ContributorList from "/client/component/compound/contributor-list";
import DashboardButtonForm from "/client/component/compound/dashboard-button-form";
import FeaturePane from "/client/component/compound/feature-pane";
import FormPane from "/client/component/compound/form-pane";
import GiftPane from "/client/component/compound/gift-pane";
import GithubButton from "/client/component/compound/github-button";
import LoginForm from "/client/component/compound/login-form";
import Logo from "/client/component/compound/logo";
import NotificationList from "/client/component/compound/notification-list";
import OverallAggregationPane from "/client/component/compound/overall-aggregation-pane";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./top-page.scss"))
export default class TopPage extends Component<Props, State> {

  public render(): ReactNode {
    let loginFormStyleName = StyleNameUtil.create(
      "login-form",
      {if: this.props.store!.user === null, false: "hidden"}
    );
    let dashboardButtonFormStyleName = StyleNameUtil.create(
      "dashboard-button-form",
      {if: this.props.store!.user === null, true: "hidden"}
    );
    let node = (
      <Page>
        <div styleName="top">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form-wrapper">
            <FormPane>
              <div styleName={loginFormStyleName}>
                <LoginForm showRegister={true}/>
              </div>
              <div styleName={dashboardButtonFormStyleName}>
                <DashboardButtonForm/>
              </div>
            </FormPane>
          </div>
        </div>
        <div styleName="aggregation">
          <OverallAggregationPane/>
        </div>
        <div styleName="border feature">
          <FeaturePane/>
        </div>
        <div styleName="border notification">
          <NotificationList size={1} showPagination={false}/>
        </div>
        <div styleName="border github">
          <div styleName="github-inner">
            <GithubButton/>
            <ContributorList/>
          </div>
          <div styleName="gift">
            <GiftPane/>
          </div>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};