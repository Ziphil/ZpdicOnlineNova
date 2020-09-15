//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import ChangeUserEmailForm from "/client/component/compound/dashboard/change-user-email-form";
import ChangeUserPasswordForm from "/client/component/compound/dashboard/change-user-password-form";
import ChangeUserScreenNameForm from "/client/component/compound/dashboard/change-user-screen-name-form";
import CreateDictionaryForm from "/client/component/compound/dashboard/create-dictionary-form";
import DeleteUserForm from "/client/component/compound/dashboard/delete-user-form";
import DictionaryList from "/client/component/compound/dictionary-list";
import InvitationList from "/client/component/compound/invitation-list";
import Menu from "/client/component/compound/menu";
import SettingPane from "/client/component/compound/setting-pane";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  UserDictionary
} from "/server/skeleton/dictionary";
import {
  Invitation
} from "/server/skeleton/invitation";


@style(require("./dashboard-page.scss"))
export default class DashboardPage extends Component<Props, State, Params> {

  public state: State = {
    dictionaries: null,
    editInvitations: null
  };

  public async componentDidMount(): Promise<void> {
    let promise = Promise.all([this.fetchDictionaries(), this.fetchEditInvitations()]);
    await promise;
  }

  public async fetchDictionaries(): Promise<void> {
    let response = await this.requestGet("fetchDictionaries", {});
    if (response.status === 200) {
      let dictionaries = response.data;
      this.setState({dictionaries});
    }
  }

  public async fetchEditInvitations(): Promise<void> {
    let type = "edit";
    let response = await this.requestGet("fetchInvitations", {type});
    if (response.status === 200) {
      let editInvitations = response.data;
      this.setState({editInvitations});
    }
  }

  private renderDictionaryList(): ReactNode {
    let label = this.trans("dashboardPage.dictionaryList.label");
    let description = this.trans("dashboardPage.dictionaryList.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <DictionaryList dictionaries={this.state.dictionaries} showLinks={true} size={5}/>
      </SettingPane>
    );
    return node;
  }

  private renderInvitationList(): ReactNode {
    let label = this.trans("dashboardPage.invitationList.label");
    let description = this.trans("dashboardPage.invitationList.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <InvitationList invitations={this.state.editInvitations} size={5} onSubmit={() => this.fetchEditInvitations()}/>
      </SettingPane>
    );
    return node;
  }

  private renderCreateDictionaryForm(): ReactNode {
    let label = this.trans("dashboardPage.createDictionaryForm.label");
    let description = this.trans("dashboardPage.createDictionaryForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <CreateDictionaryForm/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeUserScreenNameForm(): ReactNode {
    let label = this.trans("dashboardPage.changeUserScreenNameForm.label");
    let description = this.trans("dashboardPage.changeUserScreenNameForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeUserScreenNameForm currentScreenName={this.props.store!.user!.screenName} onSubmit={() => this.props.store!.fetchUser()}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeUserEmailForm(): ReactNode {
    let label = this.trans("dashboardPage.changeUserEmailForm.label");
    let description = this.trans("dashboardPage.changeUserEmailForm.description");
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeUserEmailForm currentEmail={this.props.store!.user!.email} onSubmit={() => this.props.store!.fetchUser()}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeUserPasswordForm(): ReactNode {
    let label = this.trans("dashboardPage.changeUserPasswordForm.label");
    let description = this.trans("dashboardPage.changeUserPasswordForm.description");
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <ChangeUserPasswordForm/>
      </SettingPane>
    );
    return node;
  }

  private renderDeleteUserForm(): ReactNode {
    let label = this.trans("dashboardPage.deleteUserForm.label");
    let description = this.trans("dashboardPage.deleteUserForm.description");
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <DeleteUserForm onSubmit={() => this.pushPath("/", {}, true)}/>
      </SettingPane>
    );
    return node;
  }

  public render(): ReactNode {
    let mode = this.props.match?.params.mode || "dictionary";
    let dictionaries = this.state.dictionaries;
    let editInvitations = this.state.editInvitations;
    let dictionaryCount = (dictionaries !== null && dictionaries.length > 0) ? dictionaries.length.toLocaleString("en-GB") : undefined;
    let notificationCount = (editInvitations !== null && editInvitations.length > 0) ? editInvitations.length.toLocaleString("en-GB") : undefined;
    let menuSpecs = [
      {mode: "dictionary", label: this.trans("dashboardPage.dictionary"), iconLabel: "\uF02D", badgeValue: dictionaryCount, href: "/dashboard"},
      {mode: "notification", label: this.trans("dashboardPage.notification"), iconLabel: "\uF0F3", badgeValue: notificationCount, href: "/dashboard/notification"},
      {mode: "account", label: this.trans("dashboardPage.account"), iconLabel: "\uF2C2", href: "/dashboard/account"},
      {mode: "logout", label: this.trans("dashboardPage.logout"), iconLabel: "\uF2F5", href: "/"}
    ];
    let contentNodes = [];
    if (this.props.store!.user) {
      if (mode === "dictionary") {
        contentNodes.push(this.renderDictionaryList());
        contentNodes.push(this.renderCreateDictionaryForm());
      } else if (mode === "notification") {
        contentNodes.push(this.renderInvitationList());
      } else if (mode === "account") {
        contentNodes.push(this.renderChangeUserScreenNameForm());
        contentNodes.push(this.renderChangeUserEmailForm());
        contentNodes.push(this.renderChangeUserPasswordForm());
        contentNodes.push(this.renderDeleteUserForm());
      }
    }
    let node = (
      <Page>
        <Menu mode={mode} specs={menuSpecs}/>
        {contentNodes}
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionaries: Array<UserDictionary> | null,
  editInvitations: Array<Invitation> | null
};
type Params = {
  mode: string
};