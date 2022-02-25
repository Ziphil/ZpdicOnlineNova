//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  Helmet
} from "react-helmet";
import Highlight from "/client/component/atom/highlight";
import Markdown from "/client/component/atom/markdown";
import SourceTester from "/client/component/compound/source-tester";
import {
  create
} from "/client/component/create";
import {
  useLoaderData
} from "/client/component/hook";
import NotFoundPage from "/client/component/page/not-found-page";
import Page from "/client/component/page/page";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";


const DocumentPage = create(
  require("./document-page.scss"), "DocumentPage",
  function ({
  }: {
  }): ReactElement {

    let {source} = useLoaderData();

    if (source !== null) {
      let components = {pre: DocumentPageSourceTester};
      let title = source?.match(/<!--\s*title:\s*(.+?)\s*-->/)?.[1];
      let node = (
        <Page>
          <Helmet>
            <title>{(title) ? `${title} — ZpDIC Online` : "ZpDIC Online"}</title>
          </Helmet>
          <Markdown source={source!} type="document" components={components}/>
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
);


const DocumentPageSourceTester = create(
  require("./document-page.scss"),
  function ({
    children
  }: {
    children?: any
  }): ReactElement {

    let child = children[0];
    if (child.type === "code") {
      let match = child.props.className?.match(/^language-(.+)$/)?.[1]?.match(/^(\w+)(-try)?$/);
      let language = match?.[1] ?? "plain";
      let source = String(child.props.children);
      let modeOptions = CodeMirrorUtil.getModeOptions(language);
      if (modeOptions.mode !== undefined) {
        let innerNode = (match && match[2]) ? <SourceTester source={source} language={language}/> : <Highlight source={source} language={language}/>;
        let node = (
          <div className="block">
            {innerNode}
          </div>
        );
        return node;
      } else {
        let node = <pre>{children}</pre>;
        return node;
      }
    } else {
      let node = <pre>{children}</pre>;
      return node;
    }

  }
);


export default DocumentPage;