//

import * as react from "react";
import {
  ReactElement,
  StrictMode,
  Suspense,
  lazy,
  useCallback
} from "react";
import {
  IntlProvider
} from "react-intl";
import {
  BrowserRouter,
  Switch
} from "react-router-dom";
import {
  create
} from "/client/component-function/create";
import {
  useDefaultLocale,
  useDefaultUser
} from "/client/component-function/hook";
import Authenticator from "/client/component-function/util/authenticator";
import ScrollTop from "/client/component-function/util/scroll-top";


let NotificationPage = lazy(() => import("/client/component-function/page/notification-page"));
let TopPage = lazy(() => import("/client/component-function/page/top-page"));


const Root = create(
  require("./root.scss"), "Root",
  function ({
  }: {
  }): ReactElement | null {

    let {ready} = useDefaultUser();
    let {locale, messages} = useDefaultLocale("ja");

    let handleIntlError = useCallback(function (error: Error): void {
      console.error(error.name);
    }, []);

    let node = (ready) && (
      <StrictMode>
        <BrowserRouter>
          <IntlProvider defaultLocale="ja" locale={locale} messages={messages} onError={handleIntlError}>
            <Suspense fallback={"Suspended"}>
              <ScrollTop>
                <Switch>
                  <Authenticator type="none" exact sensitive path="/" component={TopPage}/>
                  <Authenticator type="none" exact sensitive path="/notification" component={NotificationPage}/>
                </Switch>
              </ScrollTop>
            </Suspense>
          </IntlProvider>
        </BrowserRouter>
      </StrictMode>
    );
    return node || null;

  }
);


export default Root;