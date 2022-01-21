//

import * as react from "react";
import {
  ReactElement
} from "react";
import ContributorList from "/client/component-function/compound/contributor-list";
import DashboardButtonForm from "/client/component-function/compound/dashboard-button-form";
import FeaturePane from "/client/component-function/compound/feature-pane";
import FormPane from "/client/component-function/compound/form-pane";
import GiftPane from "/client/component-function/compound/gift-pane";
import GithubButton from "/client/component-function/compound/github-button";
import LoginForm from "/client/component-function/compound/login-form";
import Logo from "/client/component-function/compound/logo";
import NotificationList from "/client/component-function/compound/notification-list";
import OverallAggregationPane from "/client/component-function/compound/overall-aggregation-pane";
import {
  create
} from "/client/component-function/create";
import {
  useUser
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";
import {
  StyleNameUtil
} from "/client/util/style-name";


const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
  }: {
  }): ReactElement {

    let user = useUser();

    let loginFormStyleName = StyleNameUtil.create(
      "login-form",
      {if: user === null, false: "hidden"}
    );
    let dashboardButtonFormStyleName = StyleNameUtil.create(
      "dashboard-button-form",
      {if: user === null, true: "hidden"}
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
);


export default TopPage;