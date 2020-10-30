//

import * as react from "react";
import {
  ReactNode
} from "react";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  DOCUMENTS
} from "/client/document";


@style(require("./document-page.scss"))
export default class DocumentPage extends Component<Props, State, Params> {

  public state: State = {
    source: null
  };

  public async componentDidMount(): Promise<void> {
    await this.fetchSource();
  }

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.location!.key !== previousProps.location!.key) {
      await this.fetchSource();
    }
  }

  private async fetchSource(): Promise<void> {
    let locale = this.props.store!.locale;
    let firstPath = (this.props.match!.params.firstPath) ? this.props.match!.params.firstPath : "";
    let secondPath = (this.props.match!.params.secondPath) ? "/" + this.props.match!.params.secondPath : "";
    let path = firstPath + secondPath;
    if (DOCUMENTS[locale] !== undefined) {
      let document = DOCUMENTS[locale].find((document) => document.path === path);
      if (document !== undefined) {
        let source = await document.fetchSource().then((module) => module.default);
        this.setState({source});
      } else {
        this.setState({source: null});
      }
    } else {
      this.setState({source: null});
    }
  }

  public render(): ReactNode {
    let markdownNode = (this.state.source !== null) && (
      <Markdown source={this.state.source} allowHeading={true}/>
    );
    let node = (
      <Page>
        {markdownNode}
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  source: string | null
};
type Params = {
  firstPath: string,
  secondPath: string
};