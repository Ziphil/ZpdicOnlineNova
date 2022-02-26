//

import {
  ReactNode,
  useCallback
} from "react";
import {
  IntlShape,
  useIntl as useRawIntl
} from "react-intl";
import {
  createGlobalState,
  useMount
} from "react-use";
import {
  Primitive
} from "ts-essentials";
import {
  LANGUAGES
} from "/client/language";
import {
  DateUtil
} from "/client/util/date";


let useRawLocale = createGlobalState("ja");
let useRawMessages = createGlobalState<Messages>({});
export let globalLocale = "ja";

export function useDefaultLocale(defaultLocale: string): {locale: string, messages: Messages} {
  let [locale] = useRawLocale();
  let [messages] = useRawMessages();
  let [, changeLocale] = useLocale();
  useMount(() => {
    let firstLocale = localStorage.getItem("locale") ?? defaultLocale;
    changeLocale(firstLocale);
  });
  return {locale, messages};
}

export function useLocale(): [string, ChangeLocaleCallback] {
  let [locale, setLocale] = useRawLocale();
  let [, setMessages] = useRawMessages();
  let changeLocale = useCallback(async function (locale: string): Promise<void> {
    let language = LANGUAGES.find((language) => language.locale === locale) ?? LANGUAGES[0];
    let messages = await language.fetchMessages().then((module) => module.default);
    globalLocale = locale;
    setLocale(locale);
    setMessages(messages);
    localStorage.setItem("locale", locale);
  }, [setLocale, setMessages]);
  return [locale, changeLocale];
}

export function useIntl(): [IntlShape, TransCallbacks] {
  let intl = useRawIntl();
  let trans = useCallback(function (id: string, values?: any): any {
    let defaultMessage = values?.defaultMessage ?? "[?]";
    let rawMessage = intl.formatMessage({id, defaultMessage}, values);
    let message = (rawMessage === "<empty>") ? "" : rawMessage;
    return message;
  }, [intl]);
  let transDate = useCallback(function (date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      let format = intl.formatMessage({id: "common.dateFormat"});
      let locale = intl.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return intl.formatMessage({id: "common.dateUndefined"});
    }
  }, [intl]);
  let transShortDate = useCallback(function (date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      let format = intl.formatMessage({id: "common.shortDateFormat"});
      let locale = intl.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return intl.formatMessage({id: "common.dateUndefined"});
    }
  }, [intl]);
  let transNumber = useCallback(function (number: number | null | undefined, digit?: number): string {
    let options = {minimumFractionDigits: digit, maximumFractionDigits: digit};
    if (number !== null && number !== undefined) {
      return intl.formatNumber(number, options);
    } else {
      return intl.formatMessage({id: "common.numberUndefined"});
    }
  }, [intl]);
  return [intl, {trans, transDate, transShortDate, transNumber}];
}

type Messages = Record<string, string>;

type ChangeLocaleCallback = (locale: string) => Promise<void>;
type TransCallback = {
  (id: string, values?: Record<string, Primitive | ((parts: Array<string>) => string)>): string,
  (id: string, values?: Record<string, Primitive | ReactNode | ((parts: Array<ReactNode>) => ReactNode)>): ReactNode
};
type TransCallbacks = {
  trans: TransCallback,
  transDate: (date: Date | number | string | null | undefined) => string,
  transShortDate: (date: Date | number | string | null | undefined) => string,
  transNumber: (number: number | null | undefined, digit?: number) => string
};