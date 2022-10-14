//

import {
  IntlError
} from "@formatjs/intl";
import {
  library as fontawesomeLibrary
} from "@fortawesome/fontawesome-svg-core";
import {
  faGithub as iconFaGithub
} from "@fortawesome/free-brands-svg-icons";
import {
  fas as iconFas
} from "@fortawesome/free-solid-svg-icons";
import {
  ReactLocation,
  Router
} from "@tanstack/react-location";
import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  DndProvider
} from "react-dnd";
import {
  HTML5Backend as DndBackend
} from "react-dnd-html5-backend";
import {
  IntlProvider
} from "react-intl";
import {
  QueryClientProvider
} from "react-query";
import {
  create
} from "/client/component/create";
import {
  queryClient,
  useDefaultLocale,
  useDefaultMe
} from "/client/component/hook";


require("../../node_modules/codemirror/lib/codemirror.css");
require("../../node_modules/c3/c3.css");

fontawesomeLibrary.add(iconFas, iconFaGithub);

const location = new ReactLocation({
  parseSearch: (searchString) => queryParser.parse(searchString),
  stringifySearch: (search) => queryParser.stringify(search)
});


const StoryRoot = create(
  require("/client/component/root.scss"), "StoryRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    const {ready} = useDefaultMe();
    const {locale, messages} = useDefaultLocale("en");

    const handleIntlError = useCallback(function (error: IntlError<any>): void {
      if (error.code !== "MISSING_DATA" && error.code !== "MISSING_TRANSLATION") {
        console.error(error);
      }
    }, []);

    const node = (
      <DndProvider backend={DndBackend}>
        <QueryClientProvider client={queryClient}>
          <IntlProvider defaultLocale="en" locale={locale} messages={messages} onError={handleIntlError} fallbackOnEmptyString={false}>
            <Router location={location} routes={[]} caseSensitive={true}>
              {children}
            </Router>
          </IntlProvider>
        </QueryClientProvider>
      </DndProvider>
    );
    return node;

  }
);


export default StoryRoot;