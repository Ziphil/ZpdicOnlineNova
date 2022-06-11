//

import * as react from "react";
import {
  ReactElement
} from "react";
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
  create
} from "/client/component/create";
import {
  useUser
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  DataUtil
} from "/client/util/data";


const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
  }: {
  }): ReactElement {

    const [user] = useUser();

    const rawContributors = [
      {name: "lynn", url: {github: "lynn"}, avatarUrl: {github: "lynn"}},
      {name: "bluebear94", url: {github: "bluebear94"}, avatarUrl: {github: "bluebear94"}},
      {name: "nymwa", url: {github: "nymwa"}, avatarUrl: {github: "nymwa"}},
      {name: "川音リオ", url: {twitter: "KawaneRio"}, avatarUrl: "https://pbs.twimg.com/profile_images/1085673171083091969/t3IjudoH_400x400.jpg"}
    ];
    const loginFormData = DataUtil.create({
      hidden: user !== null
    });
    const dashboardFormData = DataUtil.create({
      hidden: user === null
    });
    const node = (
      <Page title="">
        <div styleName="top">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form-container">
            <FormPane>
              <div styleName="login-form" {...loginFormData}>
                <LoginForm showRegister={true}/>
              </div>
              <div styleName="dashboard-button-form" {...dashboardFormData}>
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
        <div styleName="border last">
          <div styleName="github">
            <GithubButton/>
            <ContributorList rawContributors={rawContributors}/>
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