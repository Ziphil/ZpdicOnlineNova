//

import {
  useRouter
} from "@tanstack/react-location";
import nprogress from "nprogress";
import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  Suspense,
  useEffect,
  useState
} from "react";
import {
  ErrorBoundary
} from "react-error-boundary";
import Drawer from "/client/component/atom/drawer";
import ExampleEditor from "/client/component/compound/example-editor-beta";
import HotkeyHelp from "/client/component/compound/hotkey-help";
import WordEditor from "/client/component/compound/word-editor-beta";
import {
  create
} from "/client/component/create";
import {
  useExampleEditorProps,
  useHotkey,
  useIntl,
  usePath,
  useWordEditorProps
} from "/client/component/hook";
import ErrorPage from "/client/component/page/error-page";
import LoadingPage from "/client/component/page/loading-page";


const InnerRoot = create(
  null, "InnerRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    const [hotkeyHelpOpen, setHotkeyHelpOpen] = useState(false);
    const [wordEditorProps, wordEditorOpen, setWordEditorOpen] = useWordEditorProps();
    const [exampleEditorProps, exampleEditorOpen, setExampleEditorOpen] = useExampleEditorProps();
    const [, {trans}] = useIntl();
    const {pushPath} = usePath();
    const router = useRouter();

    useHotkey("jumpDashboardPage", () => {
      pushPath("/dashboard");
    }, []);
    useHotkey("jumpDictionaryListPage", () => {
      pushPath("/list");
    }, []);
    useHotkey("jumpNotificationPage", () => {
      pushPath("/notification");
    }, []);
    useHotkey("jumpDocumentPage", () => {
      pushPath("/document");
    }, []);
    useHotkey("jumpContactPage", () => {
      pushPath("/contact");
    }, []);
    useHotkey("toggleWordEditor", () => {
      setWordEditorOpen((wordEditorOpen) => !wordEditorOpen);
    }, []);
    useHotkey("showHotkeyHelp", () => {
      setHotkeyHelpOpen(true);
    }, []);
    useHotkey("unfocus", () => {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, []);

    useEffect(() => {
      if (router.pending) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    }, [router.pending]);

    const wordEditorNodes = wordEditorProps.map((props) => {
      const wordEditorNode = <WordEditor key={props.id} {...props}/>;
      return wordEditorNode;
    });
    const exampleEditorNodes = exampleEditorProps.map((props) => {
      const exampleEditorNode = <ExampleEditor key={props.id} {...props}/>;
      return exampleEditorNode;
    });
    const node = (
      <Fragment>
        <ErrorBoundary fallbackRender={ErrorPage}>
          <Suspense fallback={<LoadingPage/>}>
            {children}
          </Suspense>
        </ErrorBoundary>
        <Drawer
          title={trans("wordEditor.title")}
          iconName="custom-word"
          badgeValue={(wordEditorNodes.length > 0) ? wordEditorNodes.length : undefined}
          tabPosition="top"
          open={wordEditorOpen}
          onOpen={() => setWordEditorOpen(true)}
          onClose={() => setWordEditorOpen(false)}
          outsideClosable={true}
        >
          {wordEditorNodes}
        </Drawer>
        <Drawer
          title={trans("exampleEditor.title")}
          iconName="custom-example"
          badgeValue={(exampleEditorNodes.length > 0) ? exampleEditorNodes.length : undefined}
          tabPosition="bottom"
          open={exampleEditorOpen}
          onOpen={() => setExampleEditorOpen(true)}
          onClose={() => setExampleEditorOpen(false)}
          outsideClosable={true}
        >
          {exampleEditorNodes}
        </Drawer>
        <HotkeyHelp open={hotkeyHelpOpen} onClose={() => setHotkeyHelpOpen(false)}/>
      </Fragment>
    );
    return node;

  }
);


export default InnerRoot;