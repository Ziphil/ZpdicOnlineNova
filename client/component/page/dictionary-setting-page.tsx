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
  DictionaryHeader,
  DictionaryRenameForm,
  DictionaryUploadForm,
  Header,
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


@applyStyle(require("./dictionary-setting-page.scss"))
class DictionarySettingPageBase extends ComponentBase<Props, State, Params> {

  public state: State = {
    dictionary: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.match!.params.number;
    let response = await http.get("dictionaryInfo", {number}, [400]);
    let body = response.data;
    if (!("error" in body)) {
      let dictionary = body;
      this.setState({dictionary});
    } else {
      this.setState({dictionary: null});
    }
  }

  private renderDictionaryRenameFormNode(): ReactNode {
    let label = "名称変更";
    let description = `
      辞書の名称を変更します。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <DictionaryRenameForm number={this.state.dictionary!.number} currentName={this.state.dictionary!.name}/>
      </SettingPane>
    );
    return node;
  }

  private renderDictionaryUploadFormNode(): ReactNode {
    let label = "アップロード";
    let description = `
      ファイルをアップロードし、現在のデータを上書きします。
    `;
    let node = (
      <SettingPane label={label} key={label} description={description}>
        <DictionaryUploadForm number={this.state.dictionary!.number}/>
      </SettingPane>
    );
    return node;
  }

  private renderNothingNode(): ReactNode {
    let label = "?";
    let node = (
      <SettingPane label={label} key={label}>
        Not yet implemented
      </SettingPane>
    );
    return node;
  }

  public render(): ReactNode {
    let menuSpecs = [{mode: "general", label: "一般", iconLabel: "\uF013", href: ""}];
    let contentNodes = [];
    if (this.state.dictionary) {
      contentNodes.push(this.renderDictionaryRenameFormNode());
      contentNodes.push(this.renderDictionaryUploadFormNode());
      contentNodes.push(this.renderNothingNode());
    }
    let node = (
      <div styleName="page">
        <Header/>
        <DictionaryHeader name={this.state.dictionary?.name || ""}/>
        <div styleName="content">
          <Menu mode="general" specs={menuSpecs}/>
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
  dictionary: SlimeDictionarySkeleton | null
};
type Params = {
  number: string;
};

export let DictionarySettingPage = withRouter(DictionarySettingPageBase);