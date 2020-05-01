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
    showsSetting: false,
    showsDownload: true,
    preservesQuery: false
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
    let nameNode;
    if (this.props.dictionary) {
      let href = "/dictionary/" + this.props.dictionary.number;
      if (this.props.preservesQuery) {
        let queryString = this.props.location!.search;
        href += queryString;
      }
      nameNode = <Link href={href} style="plane">{this.props.dictionary.name}</Link>;
    }
    let settingButtonNode;
    if (this.props.showsSetting) {
      settingButtonNode = <Button iconLabel="&#xF013;" style="simple" onClick={this.jumpSettingPage.bind(this)}/>;
    }
    let downloadButtonNode;
    if (this.props.showsDownload) {
      downloadButtonNode = <Button iconLabel="&#xF019;" style="simple" onClick={this.downloadDictionary.bind(this)}/>;
    }
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="button">
              {settingButtonNode}
              {downloadButtonNode}
            </div>
            <div styleName="name">
              {nameNode}
            </div>
          </div>
        </div>
      </header>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton | null,
  showsSetting: boolean,
  showsDownload: boolean,
  preservesQuery: boolean
};
type State = {
};