//

import {
  IntlShape
} from "react-intl";


export class PopupUtil {

  public static getMessage(intl: IntlShape, type: string, values?: Record<string, string>): string {
    const defaultMessage = intl.formatMessage({id: "popup.messageNotFound"});
    const message = intl.formatMessage({id: "popup." + type, defaultMessage}, values);
    return message;
  }

}