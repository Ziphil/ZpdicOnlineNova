//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  ChangeUserEmailForm,
  ChangeUserPasswordForm,
  CreateDictionaryForm,
  DictionaryList,
  Header,
  Loading,
  Menu,
  SettingPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";
import {
  SlimeDictionarySkeleton
} from "/server/model/dictionary/slime";
import {
  UserSkeleton
} from "/server/model/user";


@applyStyle(require("./dashboard-page.scss"))
class DashboardPageBase extends ComponentBase<Props, State, Params> {

  public state: State = {
    user: null,
    dictionaries: null
  };

  public async componentDidMount(): Promise<void> {
    try {
      {
        let response = await http.get("fetchUserInfo", {});
        let user = response.data;
        this.setState({user});
      }
      {
        let response = await http.get("fetchDictionaries", {});
        let dictionaries = response.data;
        this.setState({dictionaries});
      }
    } catch (error) {
      this.jumpLogin(error);
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
          <DictionaryList dictionaries={this.state.dictionaries!} showsSetting={true}/>
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
        <CreateDictionaryForm onSubmit={() => location.reload()}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeEmailForm(): ReactNode {
    let label = "メールアドレス変更";
    let description = `
      メールアドレスを変更します。
    `;
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <ChangeUserEmailForm currentEmail={this.state.user!.email} onSubmit={() => location.reload()}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeUserPasswordForm(): ReactNode {
    let label = "パスワード変更";
    let description = `
      パスワードを変更します。
    `;
    let node = (
      <SettingPane label={label} description={description} key={label}>
        <ChangeUserPasswordForm onSubmit={() => location.reload()}/>
      </SettingPane>
    );
    return node;
  }

  public render(): ReactNode {
    let mode = this.props.match?.params.mode || "dictionary";
    let menuSpecs = [
      {mode: "dictionary", label: "辞書", iconLabel: "\uF02D", href: "/dashboard"},
      {mode: "setting", label: "設定", iconLabel: "\uF4FE", href: "/dashboard/setting"},
      {mode: "logout", label: "ログアウト", iconLabel: "\uF2F5", href: "/"}
    ];
    let contentNodes = [];
    if (this.state.user) {
      if (mode === "dictionary") {
        contentNodes.push(this.renderDictionaryList());
        contentNodes.push(this.renderCreateDictionaryForm());
      } else if (mode === "setting") {
        contentNodes.push(this.renderChangeEmailForm());
        contentNodes.push(this.renderChangeUserPasswordForm());
      }
    }
    let node = (
      <div styleName="page">
        <Header/>
        <div styleName="content">
          <Menu mode={mode} specs={menuSpecs}/>
          {contentNodes}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  user: UserSkeleton | null,
  dictionaries: Array<SlimeDictionarySkeleton> | null;
};
type Params = {
  mode: string
};

export let DashboardPage = withRouter(DashboardPageBase);