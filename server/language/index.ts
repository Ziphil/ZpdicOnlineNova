//

import {
  createIntl,
  createIntlCache
} from "@formatjs/intl";


export const INTLS = [
  createIntl({locale: "ja", messages: require("./ja.yml")}, createIntlCache()),
  createIntl({locale: "en", messages: require("./en.yml")}, createIntlCache())
];