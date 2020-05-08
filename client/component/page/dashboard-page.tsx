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
  DictionarySkeleton
} from "/server/skeleton/dictionary";


@route @inject
@applyStyle(require("./dashboard-page.scss"))
export class DashboardPage extends StoreComponent<Props, State, Params> {

  public state: State = {
    dictionaries: null
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchDictionaries", {});
    if (response.status === 200) {
      let dictionaries = response.data;
      this.setState({dictionaries});
    }
  }

  private renderDictionaryList(): ReactNode {
    let label = "登録辞書一覧";
    let badgeValue = (this.state.dictionaries !== null) ? this.state.dictionaries.length.toLocaleString("en-GB") : undefined;
    let description = `
      このユーザーに登録されている辞書の一覧です。
      辞書の閲覧や編集ができます。
    `;
    let node = (
      <SettingPane label={label} badgeValue={badgeValue} key={label} description={description}>
        <Loading loading={this.state.dictionaries === null}>
          <DictionaryList dictionaries={this.state.dictionaries!} showsSetting={true} size={8}/>
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
    let menuSpecs = [
      {mode: "dictionary", label: "辞書", iconLabel: "\uF02D", href: "/dashboard"},
      {mode: "notification", label: "通知", iconLabel: "\uF0F3", href: "/dashboard/notification"},
      {mode: "profile", label: "アカウント", iconLabel: "\uF2C2", href: "/dashboard/profile"},
      {mode: "logout", label: "ログアウト", iconLabel: "\uF2F5", href: "/"}
    ];
    let contentNodes = [];
    if (this.props.store!.user) {
      if (mode === "dictionary") {
        contentNodes.push(this.renderDictionaryList());
        contentNodes.push(this.renderCreateDictionaryForm());
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
  dictionaries: Array<DictionarySkeleton> | null;
};
type Params = {
  mode: string
};