//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import ContributorList from "/client/component/compound/contributor-list";
import DictionaryAggregationPane from "/client/component/compound/dictionary-aggregation-pane";
import FeaturePane from "/client/component/compound/feature-pane";
import FormPane from "/client/component/compound/form-pane";
import GithubButton from "/client/component/compound/github-button";
import LoginForm from "/client/component/compound/login-form";
import Logo from "/client/component/compound/logo";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./top-page.scss"))
export default class TopPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="logo-wrapper">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form">
            <FormPane>
              <LoginForm showRegister={true}/>
            </FormPane>
          </div>
        </div>
        <div styleName="aggregation">
          <DictionaryAggregationPane/>
        </div>
        <div styleName="feature border">
          <FeaturePane/>
        </div>
        <div styleName="github border">
          <GithubButton/>
          <ContributorList/>
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