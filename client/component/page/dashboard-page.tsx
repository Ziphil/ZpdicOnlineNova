//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  ChangeUserEmailForm,
  ChangeUserPasswordForm,
  CreateDictionaryForm,
  DictionaryList,
  InvitationList,
  Loading,
  Menu,
  SettingPane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";
import {
  UserDictionary
} from "/server/skeleton/dictionary";
import {
  Invitation
} from "/server/skeleton/invitation";


@route @inject
@applyStyle(require("./dashboard-page.scss"))
export class DashboardPage extends StoreComponent<Props, State, Params> {

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
    let label = "辞書一覧";
    let description = `
      このユーザーの辞書一覧です。
      このユーザーが管理者ではなくても、編集権限があれば表示されます。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <Loading loading={this.state.dictionaries === null}>
          <DictionaryList dictionaries={this.state.dictionaries!} showLinks={true} size={8}/>
        </Loading>
      </SettingPane>
    );
    return node;
  }

  private renderInvitationList(): ReactNode {
    let label = "編集権限の付与の招待";
    let description = `
      このユーザーに送られてきた編集権限の付与の招待の一覧です。
      これを承認すると、該当の辞書を編集できるようになります。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <Loading loading={this.state.editInvitations === null}>
          <InvitationList invitations={this.state.editInvitations!} size={8} onSubmit={() => this.fetchEditInvitations()}/>
        </Loading>
      </SettingPane>
    );
    return node;
  }

  private renderCreateDictionaryForm(): ReactNode {
    let label = "新規作成";
    let description = `
      空の辞書を作成します。
    `;
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <CreateDictionaryForm/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeEmailForm(): ReactNode {
    let label = "メールアドレスの変更";
    let description = `
      メールアドレスを変更します。
    `;
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <ChangeUserEmailForm currentEmail={this.props.store!.user!.email}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeUserPasswordForm(): ReactNode {
    let label = "パスワードの変更";
    let description = `
      パスワードを変更します。
    `;
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <ChangeUserPasswordForm/>
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
      {mode: "dictionary", label: "辞書", iconLabel: "\uF02D", badgeValue: dictionaryCount, href: "/dashboard"},
      {mode: "notification", label: "通知", iconLabel: "\uF0F3", badgeValue: notificationCount, href: "/dashboard/notification"},
      {mode: "profile", label: "アカウント", iconLabel: "\uF2C2", href: "/dashboard/profile"},
      {mode: "logout", label: "ログアウト", iconLabel: "\uF2F5", href: "/"}
    ];
    let contentNodes = [];
    if (this.props.store!.user) {
      if (mode === "dictionary") {
        contentNodes.push(this.renderDictionaryList());
        contentNodes.push(this.renderCreateDictionaryForm());
      } else if (mode === "notification") {
        contentNodes.push(this.renderInvitationList());
      } else if (mode === "profile") {
        contentNodes.push(this.renderChangeEmailForm());
        contentNodes.push(this.renderChangeUserPasswordForm());
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