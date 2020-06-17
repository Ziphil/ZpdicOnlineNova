//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  ChangeDictionaryExplanationForm,
  ChangeDictionaryNameForm,
  ChangeDictionaryParamNameForm,
  ChangeDictionarySecretForm,
  DeleteDictionaryForm,
  InviteEditDictionaryForm,
  Menu,
  SettingPane,
  UploadDictionaryForm
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
  Dictionary
} from "/server/skeleton/dictionary";


@route @inject
@applyStyle(require("./dictionary-setting-page.scss"))
export class DictionarySettingPage extends StoreComponent<Props, State, Params> {

  public state: State = {
    dictionary: null,
    authorized: false
  };

  public async componentDidMount(): Promise<void> {
    let promise = Promise.all([this.fetchDictionary(), this.checkAuthorization()]);
    await promise;
  }

  private async fetchDictionary(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.requestGet("fetchDictionary", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = response.data;
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private async checkAuthorization(): Promise<void> {
    let number = +this.props.match!.params.number;
    let authority = "own" as const;
    let response = await this.requestGet("checkDictionaryAuthorization", {number, authority});
    if (response.status === 200) {
      this.setState({authorized: true});
    }
  }

  private renderChangeDictionaryNameForm(): ReactNode {
    let label = "表示名の変更";
    let description = `
      この辞書の表示名を変更します。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionaryNameForm number={this.state.dictionary!.number} currentName={this.state.dictionary!.name} onSubmit={this.fetchDictionary.bind(this)}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryParamNameForm(): ReactNode {
    let label = "URL 用名称の変更";
    let description = `
      この辞書の URL 用名称を変更します。
      これを設定しておくと、辞書ページの URL として、ID 番号の代わりにこの名称にしたものも利用できるようになります。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionaryParamNameForm number={this.state.dictionary!.number} currentParamName={this.state.dictionary!.paramName} onSubmit={this.fetchDictionary.bind(this)}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionaryExplanationForm(): ReactNode {
    let label = "説明の変更";
    let description = `
      辞書の説明を変更します。
      一部の Markdown 形式に対応しています。
      この内容は、最初に辞書ページを開いたときに検索結果の代わりに表示されます。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionaryExplanationForm number={this.state.dictionary!.number} currentExplanation={this.state.dictionary!.explanation ?? ""}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionarySecretForm(): ReactNode {
    let label = "一覧表示の変更";
    let description = `
      この辞書を辞書一覧ページに表示するかどうかを変更します。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionarySecretForm number={this.state.dictionary!.number} currentSecret={this.state.dictionary!.secret}/>
      </SettingPane>
    );
    return node;
  }

  private renderUploadDictionaryForm(): ReactNode {
    let label = "アップロード";
    let description = `
      ファイルをアップロードし、現在のデータを上書きします。
      OTM-JSON 形式 (拡張子 .json) と PDIC 形式 (拡張子 .dic) に対応しています。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <UploadDictionaryForm number={this.state.dictionary!.number}/>
      </SettingPane>
    );
    return node;
  }

  private renderDeleteDictionaryForm(): ReactNode {
    let label = "削除";
    let description = `
      この辞書を削除します。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <DeleteDictionaryForm number={this.state.dictionary!.number} onSubmit={() => this.pushPath("/dashboard", {}, true)}/>
      </SettingPane>
    );
    return node;
  }

  private renderInviteEditDictionaryForm(): ReactNode {
    let label = "編集権限";
    let description = `
      この辞書の編集権限を別のユーザーにも付与します。
      権限を付与されたユーザーは、単語の編集や削除はできますが、辞書の表示名の変更や削除はできません。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <InviteEditDictionaryForm number={this.state.dictionary!.number} dictionary={this.state.dictionary!}/>
      </SettingPane>
    );
    return node;
  }

  public render(): ReactNode {
    let number = +this.props.match!.params.number;
    let mode = this.props.match?.params.mode || "general";
    let menuSpecs = [
      {mode: "general", label: "一般", iconLabel: "\uF013", href: "/dictionary-setting/" + number},
      {mode: "access", label: "権限", iconLabel: "\uF0C0", href: "/dictionary-setting/access/" + number}
    ];
    let contentNodes = [];
    if (this.state.dictionary && this.state.authorized) {
      if (mode === "general") {
        contentNodes.push(this.renderChangeDictionaryNameForm());
        contentNodes.push(this.renderChangeDictionaryParamNameForm());
        contentNodes.push(this.renderChangeDictionaryExplanationForm());
        contentNodes.push(this.renderChangeDictionarySecretForm());
        contentNodes.push(this.renderUploadDictionaryForm());
        contentNodes.push(this.renderDeleteDictionaryForm());
      } else if (mode === "access") {
        contentNodes.push(this.renderInviteEditDictionaryForm());
      }
    }
    let node = (
      <Page dictionary={this.state.dictionary} showDictionary={true}>
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
  dictionary: Dictionary | null,
  authorized: boolean
};
type Params = {
  number: string,
  mode: string
};