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
import Loading from "/client/component/compound/loading";
import SourceTester from "/client/component/compound/source-tester";
import {
  style
} from "/client/component/decorator";
import NotFoundPage from "/client/component/page/not-found-page";
import Page from "/client/component/page/page";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";


@style(require("./document-page.scss"))
export default class DocumentPage extends Component<Props, State, Params> {

  public state: State = {
    source: null,
    found: true
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
    this.setState({source: null, found: true});
    let locale = this.props.store!.locale;
    let firstPath = (this.props.match!.params.firstPath) ? this.props.match!.params.firstPath : "";
    let secondPath = (this.props.match!.params.secondPath) ? "/" + this.props.match!.params.secondPath : "";
    let path = firstPath + secondPath;
    let response = await this.request("fetchDocument", {locale, path}, {ignoreError: true});
    if (response.status === 200 && typeof response.data === "string") {
      let source = response.data;
      this.setState({source});
    } else {
      this.setState({source: "", found: false});
    }
  }

  private renderSourceTester(props: {language: string | null, value: string}): ReactElement {
    let match = props.language?.match(/^(\w+)(-try)?$/);
    let language = (match !== null && match !== undefined) ? match[1] : "plain";
    let modeOptions = CodeMirrorUtil.getModeOptions(language);
    if (modeOptions.mode !== undefined) {
      let innerNode = (match && match[2]) ? <SourceTester source={props.value} language={language}/> : <Highlight value={props.value} language={language}/>;
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
    if (this.state.found) {
      let renderers = {code: this.renderSourceTester};
      let node = (
        <Page>
          <Loading loading={this.state.source === null}>
            <Markdown source={this.state.source!} allowHeading={true} renderers={renderers}/>
          </Loading>
        </Page>
      );
      return node;
    } else {
      let node = (
        <NotFoundPage/>
      );
      return node;
    }
  }

}


type Props = {
};
type State = {
  source: string | null,
  found: boolean
};
type Params = {
  firstPath: string,
  secondPath: string
};