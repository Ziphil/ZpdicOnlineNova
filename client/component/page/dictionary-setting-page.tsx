//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  ChangeDictionaryNameForm,
  ChangeDictionarySecretForm,
  DeleteDictionaryForm,
  DictionaryHeader,
  Header,
  Menu,
  PopupInformationPane,
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
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


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
    let response = await this.requestGet("fetchDictionaryInfo", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let dictionary = response.data;
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private async checkAuthorization(): Promise<void> {
    let number = +this.props.match!.params.number;
    let response = await this.requestGet("checkDictionaryAuthorization", {number});
    if (response.status === 200) {
      this.setState({authorized: true});
    }
  }

  private renderChangeDictionaryNameForm(): ReactNode {
    let label = "名称変更";
    let description = `
      この辞書の名称を変更します。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <ChangeDictionaryNameForm number={this.state.dictionary!.number} currentName={this.state.dictionary!.name} onSubmit={this.fetchDictionary.bind(this)}/>
      </SettingPane>
    );
    return node;
  }

  private renderChangeDictionarySecretForm(): ReactNode {
    let label = "一覧表示変更";
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
        <DeleteDictionaryForm number={this.state.dictionary!.number} onSubmit={() => this.pushPath("/dashboard", true)}/>
      </SettingPane>
    );
    return node;
  }

  public render(): ReactNode {
    let menuSpecs = [{mode: "general", label: "一般", iconLabel: "\uF013", href: ""}];
    let contentNodes = [];
    if (this.state.dictionary && this.state.authorized) {
      contentNodes.push(this.renderChangeDictionaryNameForm());
      contentNodes.push(this.renderChangeDictionarySecretForm());
      contentNodes.push(this.renderUploadDictionaryForm());
      contentNodes.push(this.renderDeleteDictionaryForm());
    }
    let node = (
      <Page>
        <Menu mode="general" specs={menuSpecs}/>
        {contentNodes}
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: SlimeDictionarySkeleton | null,
  authorized: boolean
};
type Params = {
  number: string;
};