//

import {
  createIntl,
  createIntlCache
} from "@formatjs/intl";
import {
  ClientResponse
} from "@sendgrid/client/src/response";
import {
  EmailData
} from "@sendgrid/helpers/classes/email-address";
import {
  send as sendMailOriginal
} from "@sendgrid/mail";


const INTL = createIntl(
  {locale: "ja", messages: require("../language/ja.yml")},
  createIntlCache()
);


export class MailUtil {

  public static getSubject(type: string, values?: Record<string, string>): string {
    let title = INTL.formatMessage({id: "mail." + type + ".subject"}, values);
    return title;
  }

  public static getText(type: string, values?: Record<string, string>): string {
    let text = INTL.formatMessage({id: "mail." + type + ".text"}, values);
    let footer = INTL.formatMessage({id: "mail.footer"});
    let wholeText = text + "\n" + footer;
    return wholeText;
  }

  public static async send(to: EmailData, subject: string, text: string): Promise<ClientResponse> {
    let from = {name: "ZpDIC Online", email: "zpdic@ziphil.com"};
    let trackingSettings = {clickTracking: {enable: false, enableText: false}};
    let message = {to, from, subject, text, trackingSettings};
    let response = await sendMailOriginal(message);
    return response[0];
  }

}