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
  useLocale,
  useParams,
  useSuspenseQuery
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";


const DocumentPage = create(
  require("./document-page.scss"), "DocumentPage",
  function ({
  }: {
  }): ReactElement {

    const {firstPath, secondPath} = useParams();
    const [locale] = useLocale();
    const path = ((firstPath) ? firstPath : "") + ((secondPath) ? "/" + secondPath : "");
    const [source] = useSuspenseQuery("fetchDocument", {path, locale});

    const components = {pre: DocumentPageSourceTester};
    const title = source?.match(/<!--\s*title:\s*(.+?)\s*-->/)?.[1];
    const node = (
      <Page>
        <Helmet>
          <title>{(title) ? `${title} — ZpDIC Online` : "ZpDIC Online"}</title>
        </Helmet>
        <Markdown source={source} type="document" components={components}/>
      </Page>
    );
    return node;

  }
);


const DocumentPageSourceTester = create(
  require("./document-page.scss"),
  function ({
    children
  }: {
    children?: any
  }): ReactElement {

    const child = children[0];
    if (child.type === "code") {
      const match = child.props.className?.match(/^language-(.+)$/)?.[1]?.match(/^(\w+)(-try)?$/);
      const language = match?.[1] ?? "plain";
      const source = String(child.props.children);
      const modeOptions = CodeMirrorUtil.getModeOptions(language);
      if (modeOptions.mode !== undefined) {
        const node = (
          <div className="block">
            {(match && match[2]) ? <SourceTester source={source} language={language}/> : <Highlight source={source} language={language}/>}
          </div>
        );
        return node;
      } else {
        const node = <pre>{children}</pre>;
        return node;
      }
    } else {
      const node = <pre>{children}</pre>;
      return node;
    }

  }
);


export default DocumentPage;