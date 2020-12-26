//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import FileInput from "/client/component/atom/file-input";
import Component from "/client/component/component";
import PaneList from "/client/component/compound/pane-list";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


@style(require("./resource-list.scss"))
export default class ResourceList extends Component<Props, State> {

  public state: State = {
    file: null
  };

  public constructor(props: Props) {
    super(props);
    this.provideResources = this.provideResources.bind(this);
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
      let response = await this.request("fetchUploadResourceUrl", {number, name, type});
      if (response.status === 200 && !("error" in response.data)) {
        let url = response.data.url;
        let client = new XMLHttpRequest();
        let outerThis = this;
        client.open("PUT", url);
        client.onreadystatechange = function (): void {
          if (client.readyState === 4) {
            if (client.status === 200) {
              console.log("Done");
              outerThis.provideResources = outerThis.provideResources.bind(outerThis);
              outerThis.setState({file: null});
            } else {
              console.log("Weird");
            }
          }
        };
        client.send(file);
      }
    }
  }

  public render(): ReactNode {
    let outerThis = this;
    let styles = this.props.styles!;
    let renderer = function (resource: string): ReactNode {
      let url = `https://zpdic-test.s3.amazonaws.com/resource/${outerThis.props.dictionary.number}/${resource}`;
      let node = (
        <div>
          <img className={styles["image"]} src={url}/>
          {resource}
        </div>
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
          <PaneList items={this.provideResources} size={this.props.size} column={2} method="table" style="spaced" border={true} renderer={renderer}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  size: number
};
type State = {
  file: File | null
};