//

import {
  ReactNode,
  useCallback,
  useMemo
} from "react";
import {
  IntlShape,
  useIntl as useRawIntl
} from "react-intl";
import {
  useMount
} from "react-use";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from "recoil";
import {
  Primitive
} from "ts-essentials";
import {
  LANGUAGES
} from "/client/language";
import {
  DateUtil
} from "/client/util/date";


const localeAtom = atom({key: "locale", default: "ja"});
const messagesAtom = atom<Messages>({key: "messages", default: {}});
export let globalLocale = "ja";

export function useDefaultLocale(defaultLocale: string): {locale: string, messages: Messages} {
  const locale = useRecoilValue(localeAtom);
  const messages = useRecoilValue(messagesAtom);
  const [, changeLocale] = useLocale();
  useMount(() => {
    const firstLocale = localStorage.getItem("locale") ?? defaultLocale;
    changeLocale(firstLocale);
  });
  return {locale, messages};
}

export function useLocale(): [string, ChangeLocaleCallback] {
  const [locale, setLocale] = useRecoilState(localeAtom);
  const setMessages = useSetRecoilState(messagesAtom);
  const changeLocale = useCallback(async function (locale: string): Promise<void> {
    const language = LANGUAGES.find((language) => language.locale === locale) ?? LANGUAGES[0];
    const messages = await language.fetchMessages().then((module) => module.default);
    globalLocale = locale;
    setLocale(locale);
    setMessages(messages);
    document.documentElement.setAttribute("lang", locale);
    localStorage.setItem("locale", locale);
  }, [setLocale, setMessages]);
  return [locale, changeLocale];
}

export function useIntl(): IntlShape {
  const intl = useRawIntl();
  return intl;
}

export function useTrans(scope?: string): TransCallbacks {
  const intl = useRawIntl();
  const trans = useCallback(function (subId: string, values?: any): any {
    const id = (subId.charAt(0) === ":") ? subId.slice(1) : ((scope !== undefined) ? `${scope}.` : "") + subId;
    const defaultMessage = values?.defaultMessage ?? "[?]";
    const rawMessage = intl.formatMessage({id, defaultMessage}, values);
    const message = (rawMessage === "<empty>") ? "" : rawMessage;
    return message;
  }, [intl, scope]);
  const transDate = useCallback(function (date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      const format = intl.formatMessage({id: "common.dateFormat"});
      const locale = intl.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return intl.formatMessage({id: "common.dateUndefined"});
    }
  }, [intl]);
  const transShortDate = useCallback(function (date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      const format = intl.formatMessage({id: "common.shortDateFormat"});
      const locale = intl.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return intl.formatMessage({id: "common.dateUndefined"});
    }
  }, [intl]);
  const transNumber = useCallback(function (number: number | null | undefined, digit?: number): string {
    const options = {minimumFractionDigits: digit, maximumFractionDigits: digit};
    if (number !== null && number !== undefined) {
      return intl.formatNumber(number, options);
    } else {
      return intl.formatMessage({id: "common.numberUndefined"});
    }
  }, [intl]);
  const transNode = trans;
  return useMemo(() => ({trans, transNode, transDate, transShortDate, transNumber}), [trans, transNode, transDate, transShortDate, transNumber]);
}

type Messages = Record<string, string>;

type ChangeLocaleCallback = (locale: string) => Promise<void>;
type TransCallback = {
  (id: string, values?: Record<string, Primitive | ((parts: Array<string>) => string)>): string,
  (id: string, values?: Record<string, Primitive | ReactNode | ((parts: Array<ReactNode>) => ReactNode)>): ReactNode
};
type TransCallbacks = {
  trans: TransCallback,
  transNode: (id: string, values?: Record<string, ReactNode | ((parts: Array<ReactNode>) => ReactNode)>) => ReactNode,
  transDate: (date: Date | number | string | null | undefined) => string,
  transShortDate: (date: Date | number | string | null | undefined) => string,
  transNumber: (number: number | null | undefined, digit?: number) => string
};