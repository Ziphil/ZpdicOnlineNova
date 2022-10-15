//

import {
  useRouter
} from "@tanstack/react-location";
import nprogress from "nprogress";
import {
  Fragment,
  ReactElement,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  ErrorBoundary,
  FallbackProps
} from "react-error-boundary";
import Drawer from "/client/component/atom/drawer";
import GoogleAnalytics from "/client/component/atom/google-analytics";
import ExampleEditor from "/client/component/compound/example-editor-beta";
import HotkeyHelp from "/client/component/compound/hotkey-help";
import WordEditor from "/client/component/compound/word-editor-beta";
import {
  create
} from "/client/component/create";
import {
  QueryError,
  useExampleEditorProps,
  useHotkey,
  useIntl,
  usePath,
  useWordEditorProps
} from "/client/component/hook";
import ErrorPage from "/client/component/page/error-page";
import LoadingPage from "/client/component/page/loading-page";
import ScrollTop from "/client/component/util/scroll-top";
import {
  ANALYTICS_ID
} from "/client/variable";
import NotFoundPage from "./page/not-found-page";


const InnerRoot = create(
  null, "InnerRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {pushPath} = usePath();
    const router = useRouter();
    const [wordEditorProps, wordEditorOpen, setWordEditorOpen] = useWordEditorProps();
    const [exampleEditorProps, exampleEditorOpen, setExampleEditorOpen] = useExampleEditorProps();

    const [hotkeyHelpOpen, setHotkeyHelpOpen] = useState(false);
    const resetErrorBoundaryRef = useRef<(() => void) | null>(null);

    const renderFallback = useCallback(function (props: FallbackProps): ReactElement {
      resetErrorBoundaryRef.current = props.resetErrorBoundary;
      const error = props.error;
      if (QueryError.isQueryError(error)) {
        const {type, status} = error;
        if (status === 403) {
          return <NotFoundPage/>;
        } else if (type === "noSuchDictionaryNumber" || type === "noSuchDictionaryParamName") {
          return <NotFoundPage/>;
        }
      }
      return <ErrorPage {...props}/>;
    }, []);

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
        resetErrorBoundaryRef.current?.();
      }
    }, [router.pending]);

    const node = (
      <Fragment>
        <GoogleAnalytics id={ANALYTICS_ID}/>
        <ErrorBoundary fallbackRender={renderFallback}>
          <Suspense fallback={<LoadingPage/>}>
            <ScrollTop>
              {children}
            </ScrollTop>
          </Suspense>
        </ErrorBoundary>
        <Drawer
          title={trans("wordEditor.title")}
          iconName="custom-word"
          badgeValue={(wordEditorProps.length > 0) ? wordEditorProps.length : undefined}
          tabPosition="top"
          open={wordEditorOpen}
          onOpen={() => setWordEditorOpen(true)}
          onClose={() => setWordEditorOpen(false)}
          outsideClosable={true}
        >
          {wordEditorProps.map((props) => (
            <WordEditor key={props.id} {...props}/>
          ))}
        </Drawer>
        <Drawer
          title={trans("exampleEditor.title")}
          iconName="custom-example"
          badgeValue={(exampleEditorProps.length > 0) ? exampleEditorProps.length : undefined}
          tabPosition="bottom"
          open={exampleEditorOpen}
          onOpen={() => setExampleEditorOpen(true)}
          onClose={() => setExampleEditorOpen(false)}
          outsideClosable={true}
        >
          {exampleEditorProps.map((props) => (
            <ExampleEditor key={props.id} {...props}/>
          ))}
        </Drawer>
        <HotkeyHelp open={hotkeyHelpOpen} onClose={() => setHotkeyHelpOpen(false)}/>
      </Fragment>
    );
    return node;

  }
);


export default InnerRoot;