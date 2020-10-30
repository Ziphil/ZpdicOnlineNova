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
    source: ""
  };

  public async componentDidMount(): Promise<void> {
    let locale = this.props.store!.locale;
    let firstPath = (this.props.match!.params.firstPath) ? this.props.match!.params.firstPath : "";
    let secondPath = (this.props.match!.params.secondPath) ? "/" + this.props.match!.params.secondPath : "";
    let path = firstPath + secondPath;
    if (DOCUMENTS[locale] !== undefined) {
      let document = DOCUMENTS[locale].find((document) => document.path === path);
      if (document !== undefined) {
        let source = await document.fetchSource().then((module) => module.default);
        this.setState({source});
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Page>
        <Markdown source={this.state.source} allowHeading={true}/>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  source: string
};
type Params = {
  firstPath: string,
  secondPath: string
};