//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  ReactNode,
  Suspense,
  lazy
} from "react";
import Button from "/client/component/atom/button";
import Link from "/client/component/atom/link";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


@style(require("./dictionary-header.scss"))
export default class DictionaryHeader extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    showAddLink: false,
    showAddCommissionLink: true,
    showSettingLink: false,
    showDownloadLink: true,
    preserveQuery: false
  };
  public state: State = {
    wordEditorOpen: false,
    commissionEditorOpen: false
  };

  private jumpSettingPage(): void {
    if (this.props.dictionary) {
      let path = "/dashboard/dictionary/" + this.props.dictionary.number;
      this.pushPath(path);
    }
  }

  private async downloadDictionary(): Promise<void> {
    if (this.props.dictionary) {
      let number = this.props.dictionary.number;
      let response = await this.request("downloadDictionary", {number}, {responseType: "blob"});
      if (response.status === 200 && !("error" in response.data)) {
        let data = response.data;
        let disposition = response.headers["content-disposition"];
        let match = disposition.match(/filename="(.+)"/);
        let encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
        let fileName = (() => {
          if (encodedMatch !== null) {
            return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
          } else if (match !== null) {
            return match[1];
          } else {
            return "dictionary.json";
          }
        })();
        downloadFile(data, fileName);
      }
    }
  }

  private renderButtonNodes(): ReactNode {
    let addButtonNode = (this.props.showAddLink) && (
      <Button label={this.trans("dictionaryHeader.add")} iconLabel="&#xF067;" style="simple" hideLabel={true} onClick={() => this.setState({wordEditorOpen: true})}/>
    );
    let addCommissionButtonNode = (this.props.showAddCommissionLink) && (
      <Button label={this.trans("dictionaryHeader.orderWord")} iconLabel="&#xF022;" style="simple" hideLabel={true} onClick={() => this.setState({commissionEditorOpen: true})}/>
    );
    let settingButtonNode = (this.props.showSettingLink) && (
      <Button label={this.trans("dictionaryHeader.setting")} iconLabel="&#xF013;" style="simple" hideLabel={true} onClick={this.jumpSettingPage.bind(this)}/>
    );
    let downloadButtonNode = (this.props.showDownloadLink) && (
      <Button label={this.trans("dictionaryHeader.download")} iconLabel="&#xF019;" style="simple" hideLabel={true} onClick={this.downloadDictionary.bind(this)}/>
    );
    let node = (
      <div styleName="button">
        {addButtonNode}
        {addCommissionButtonNode}
        {settingButtonNode}
        {downloadButtonNode}
      </div>
    );
    return node;
  }

  private renderOverlays(): ReactNode {
    let WordEditor = lazy(() => import("/client/component/compound/word-editor"));
    let CommissionEditor = lazy(() => import("/client/component/compound/commission-editor"));
    let wordEditorNode = (this.props.dictionary !== null && this.state.wordEditorOpen) && (() => {
      let wordEditorNode = (
        <Suspense fallback="">
          <WordEditor dictionary={this.props.dictionary} word={null} open={this.state.wordEditorOpen} onClose={() => this.setState({wordEditorOpen: false})}/>
        </Suspense>
      );
      return wordEditorNode;
    })();
    let commissionEditorNode = (this.props.dictionary !== null && this.state.commissionEditorOpen) && (() => {
      let commissionEditorNode = (
        <Suspense fallback="">
          <CommissionEditor dictionary={this.props.dictionary} open={this.state.commissionEditorOpen} onClose={() => this.setState({commissionEditorOpen: false})}/>
        </Suspense>
      );
      return commissionEditorNode;
    })();
    let node = [wordEditorNode, commissionEditorNode];
    return node;
  }

  public render(): ReactNode {
    let nameNode = (this.props.dictionary) && (() => {
      let href = "/dictionary/" + this.props.dictionary.number;
      if (this.props.preserveQuery) {
        let queryString = this.props.location!.search;
        href += queryString;
      }
      let nameNode = <Link href={href} target="self" style="plane">{this.props.dictionary.name}</Link>;
      return nameNode;
    })();
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="name">{nameNode}</div>
          </div>
          <div styleName="right">
            {this.renderButtonNodes()}
          </div>
        </div>
        {this.renderOverlays()}
      </header>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary | null,
  showAddLink: boolean,
  showAddCommissionLink: boolean,
  showSettingLink: boolean,
  showDownloadLink: boolean,
  preserveQuery: boolean
};
type DefaultProps = {
  showAddLink: boolean,
  showAddCommissionLink: boolean,
  showSettingLink: boolean,
  showDownloadLink: boolean,
  preserveQuery: boolean
};
type State = {
  wordEditorOpen: boolean,
  commissionEditorOpen: boolean
};