//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
import ReactMarkdown from "react-markdown";
import {
  useLocation,
  useParams
} from "react-router-dom";
import Highlight from "/client/component-function/atom/highlight";
import Markdown from "/client/component-function/atom/markdown";
import Loading from "/client/component-function/compound/loading";
import SourceTester from "/client/component-function/compound/source-tester";
import {
  create
} from "/client/component-function/create";
import {
  useLocale,
  useRequest
} from "/client/component-function/hook";
import NotFoundPage from "/client/component-function/page/not-found-page";
import Page from "/client/component-function/page/page";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";


const DocumentPage = create(
  require("./document-page.scss"), "DocumentPage",
  function ({
  }: {
  }): ReactElement {

    let [source, setSource] = useState<string | null>(null);
    let [found, setFound] = useState(true);
    let params = useParams<{firstPath: string, secondPath: string}>();
    let location = useLocation();
    let [locale] = useLocale();
    let {request} = useRequest();

    let fetchSource = useCallback(async function (): Promise<void> {
      setSource(null);
      setFound(true);
      let firstPath = (params.firstPath) ? params.firstPath : "";
      let secondPath = (params.secondPath) ? "/" + params.secondPath : "";
      let path = firstPath + secondPath;
      let response = await request("fetchDocument", {locale, path}, {ignoreError: true});
      if (response.status === 200 && typeof response.data === "string") {
        let source = response.data;
        setSource(source);
      } else {
        setSource("");
        setFound(false);
      }
    }, [params.firstPath, params.secondPath, locale, request]);

    let renderSourceTester = useCallback(function (props: {language: string | null, value: string}): ReactElement {
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
        let renderCode = ReactMarkdown.renderers.code;
        if (typeof renderCode === "function") {
          let node = renderCode(props);
          return node;
        } else {
          throw new Error("cannot happen");
        }
      }
    }, []);

    useEffect(() => {
      fetchSource();
    }, [fetchSource, location.key]);

    if (found) {
      let renderers = {code: renderSourceTester};
      let node = (
        <Page>
          <Loading loading={source === null}>
            <Markdown source={source!} allowHeading={true} renderers={renderers}/>
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
);


export default DocumentPage;