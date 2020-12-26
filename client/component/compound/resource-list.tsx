//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import FileInput from "/client/component/atom/file-input";
import Component from "/client/component/component";
import PaneList from "/client/component/compound/pane-list";
import ResourcePane from "/client/component/compound/resource-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  AwsUtil
} from "/client/util/aws";
import {
  WithSize
} from "/server/controller/internal/type";


@style(require("./resource-list.scss"))
export default class ResourceList extends Component<Props, State> {

  public state: State = {
    file: null,
    resources: null
  };

  public constructor(props: Props) {
    super(props);
    this.provideResources = this.provideResources.bind(this);
    this.state.resources = this.provideResources;
  }

  private async provideResources(offset?: number, size?: number): Promise<WithSize<string>> {
    let number = this.props.dictionary.number;
    let response = await this.request("fetchResources", {number, offset, size});
    if (response.status === 200 && !("error" in response.data)) {
      let resources = response.data;
      return resources;
    } else {
      return [[], 0];
    }
  }

  private async uploadFile(): Promise<void> {
    let number = this.props.dictionary.number;
    let file = this.state.file;
    if (file) {
      let name = file.name;
      let type = file.type;
      let response = await this.request("fetchUploadResourceUrl", {number, name, type}, {useRecaptcha: true});
      if (response.status === 200 && !("error" in response.data)) {
        let url = response.data.url;
        try {
          await AwsUtil.uploadFile(url, file);
          this.setState({resources: this.provideResources.bind(this)});
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  public render(): ReactNode {
    let outerThis = this;
    let renderer = function (resource: string): ReactNode {
      let node = (
        <ResourcePane dictionary={outerThis.props.dictionary} resource={resource} showCode={outerThis.props.showCode}/>
      );
      return node;
    };
    let node = (
      <div styleName="root">
        <div styleName="form">
          <FileInput inputLabel={this.trans("resourceList.file")} onSet={(file) => this.setState({file})}/>
          <Button label={this.trans("resourceList.confirm")} reactive={true} onClick={this.uploadFile.bind(this)}/>
        </div>
        <div styleName="list">
          <PaneList items={this.state.resources} size={this.props.size} column={2} method="table" style="spaced" border={true} renderer={renderer}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  size: number,
  showCode?: boolean
};
type State = {
  file: File | null,
  resources: any
};