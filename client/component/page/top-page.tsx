//

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
  useMe
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  data
} from "/client/util/data";


const RAW_CONTRIBUTORS = [
  {name: "ゆりです。", url: {twitter: "udl_design"}, avatarUrl: "https://pbs.twimg.com/profile_images/1567141188788191232/8itkryuL_400x400.jpg"},
  {name: "bluebear94", url: {github: "bluebear94"}, avatarUrl: {github: "bluebear94"}},
  {name: "lynn", url: {github: "lynn"}, avatarUrl: {github: "lynn"}},
  {name: "nymwa", url: {github: "nymwa"}, avatarUrl: {github: "nymwa"}},
  {name: "川音リオ", url: {twitter: "KawaneRio"}, avatarUrl: "https://pbs.twimg.com/profile_images/1085673171083091969/t3IjudoH_400x400.jpg"},
  {name: "炭酸ソーダ", url: {twitter: "na2co3_ftw"}, avatarUrl: {github: "na2co3-ftw"}}
];


const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
  }: {
  }): ReactElement {

    const [me] = useMe();

    const node = (
      <Page title="">
        <div styleName="root">
          <div styleName="top">
            <div styleName="logo">
              <Logo/>
            </div>
            <div styleName="login-form-container">
              <FormPane>
                <div styleName="login-form" {...data({hidden: me !== null})}>
                  <LoginForm showRegister={true}/>
                </div>
                <div styleName="dashboard-button-form" {...data({hidden: me === null})}>
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
              <ContributorList rawContributors={RAW_CONTRIBUTORS}/>
            </div>
            <div styleName="gift">
              <GiftPane/>
            </div>
          </div>
        </div>
      </Page>
    );
    return node;

  }
);


export default TopPage;