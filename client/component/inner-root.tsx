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
import GoogleAnalytics from "/client/component/atom/google-analytics";
import ExampleEditorDrawer from "/client/component/compound/example-editor-drawer";
import HotkeyHelp from "/client/component/compound/hotkey-help";
import WordEditorDrawer from "/client/component/compound/word-editor-drawer";
import {
  create
} from "/client/component/create";
import {
  QueryError,
  useHotkey,
  usePath
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

    const {pushPath} = usePath();
    const router = useRouter();

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
        <WordEditorDrawer/>
        <ExampleEditorDrawer/>
        <HotkeyHelp open={hotkeyHelpOpen} onClose={() => setHotkeyHelpOpen(false)}/>
      </Fragment>
    );
    return node;

  }
);


export default InnerRoot;