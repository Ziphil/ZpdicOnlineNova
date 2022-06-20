//

import {
  IntlError
} from "@formatjs/intl";
import {
  ReactLocation
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

const location = new ReactLocation({
  parseSearch: (searchString) => queryParser.parse(searchString),
  stringifySearch: (search) => queryParser.stringify(search)
});


const SimpleRoot = create(
  require("./root.scss"), "SimpleRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement | null {

    const {ready} = useDefaultMe();
    const {locale, messages} = useDefaultLocale("ja");

    const handleIntlError = useCallback(function (error: IntlError<any>): void {
      if (error.code !== "MISSING_DATA" && error.code !== "MISSING_TRANSLATION") {
        console.error(error);
      }
    }, []);

    const node = (ready) && (
      <DndProvider backend={DndBackend}>
        <QueryClientProvider client={queryClient}>
          <IntlProvider defaultLocale="ja" locale={locale} messages={messages} onError={handleIntlError} fallbackOnEmptyString={false}>
            {children}
          </IntlProvider>
        </QueryClientProvider>
      </DndProvider>
    );
    return node || null;

  }
);


export default SimpleRoot;