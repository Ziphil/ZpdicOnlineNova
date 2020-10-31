//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import ReactMarkdown from "react-markdown";
import Highlight from "/client/component/atom/highlight";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import SourceTester from "/client/component/compound/source-tester";
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
        let type = document.type;
        this.setState({source, type});
      } else {
        this.setState({source: null, type: undefined});
      }
    } else {
      this.setState({source: null, type: undefined});
    }
  }

  private renderSourceTester(props: {language: string | null, value: string}): ReactElement {
    let match = props.language?.match(/^(\w+)(-try)?$/);
    let language = (match !== null && match !== undefined) ? match[1] : null;
    if (language === "akrantiain" || language === "zatlin") {
      let innerNode = (match && match[2]) ? <SourceTester source={props.value} languageName={language}/> : <Highlight value={props.value} mode={language}/>;
      let node = (
        <div className="block">
          {innerNode}
        </div>
      );
      return node;
    } else {
      if (typeof ReactMarkdown.renderers.code === "function") {
        let node = ReactMarkdown.renderers.code(props);
        return node;
      } else {
        throw new Error("cannot happen");
      }
    }
  }

  public render(): ReactNode {
    let renderers = (() => {
      let type = this.state.type;
      if (type === "tester") {
        return {code: this.renderSourceTester};
      } else {
        return undefined;
      }
    })();
    let markdownNode = (this.state.source !== null) && (
      <Markdown source={this.state.source} allowHeading={true} renderers={renderers}/>
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
  type?: string
};
type Params = {
  firstPath: string,
  secondPath: string
};