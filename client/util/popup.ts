//

import {
  IntlShape
} from "react-intl";


export class PopupUtil {

  public static getMessage(intl: IntlShape, type: string, values?: Record<string, string>): string {
    let defaultMessage = intl.formatMessage({id: "popup.messageNotFound"});
    let message = intl.formatMessage({id: "popup." + type, defaultMessage}, values);
    return message;
  }

}