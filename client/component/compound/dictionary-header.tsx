//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Button,
  Link
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  WordEditor
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-header.scss"))
export class DictionaryHeader extends StoreComponent<Props, State> {

  public static defaultProps: Partial<Props> = {
    authorized: false,
    showsDownload: true,
    preservesQuery: false
  };
  public state: State = {
    editorOpen: false
  };

  private jumpSettingPage(): void {
    if (this.props.dictionary) {
      let path = "/dictionary/setting/" + this.props.dictionary.number;
      this.pushPath(path);
    }
  }

  private downloadDictionary(): void {
    if (this.props.dictionary) {
      let path = "/api/dictionary/download?number=" + this.props.dictionary.number;
      location.replace(path);
    }
  }

  public render(): ReactNode {
    let nameNode = (this.props.dictionary) && (() => {
      let href = "/dictionary/" + this.props.dictionary.number;
      if (this.props.preservesQuery) {
        let queryString = this.props.location!.search;
        href += queryString;
      }
      return <Link href={href} style="plane">{this.props.dictionary.name}</Link>;
    })();
    let addButtonNode = (this.props.authorized) && (
      <Button label="追加" iconLabel="&#xF067;" style="simple" hideLabel={true} onClick={() => this.setState({editorOpen: true})}/>
    );
    let settingButtonNode = (this.props.authorized) && (
      <Button label="設定" iconLabel="&#xF013;" style="simple" hideLabel={true} onClick={this.jumpSettingPage.bind(this)}/>
    );
    let downloadButtonNode = (this.props.showsDownload) && (
      <Button label="ダウンロード" iconLabel="&#xF019;" style="simple" hideLabel={true} onClick={this.downloadDictionary.bind(this)}/>
    );
    let editorNode = (this.props.dictionary) && (
      <WordEditor dictionary={this.props.dictionary} word={null} open={this.state.editorOpen} onClose={() => this.setState({editorOpen: false})}/>
    );
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="name">
              {nameNode}
            </div>
          </div>
          <div styleName="right">
            <div styleName="button">
              {addButtonNode}
              {settingButtonNode}
              {downloadButtonNode}
            </div>
          </div>
        </div>
        {editorNode}
      </header>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton | null,
  authorized: boolean,
  showsDownload: boolean,
  preservesQuery: boolean
};
type State = {
  editorOpen: boolean
};