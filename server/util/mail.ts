//

import {
  ClientResponse
} from "@sendgrid/client/src/response";
import {
  EmailData
} from "@sendgrid/helpers/classes/email-address";
import {
  send as sendMailOriginal
} from "@sendgrid/mail";
import {
  INTLS
} from "/server/language";


export class MailUtil {

  public static getSubject(type: string, values?: Record<string, string>): string {
    let intl = INTLS[0];
    let title = intl.formatMessage({id: `mail.${type}.subject`}, values);
    return title;
  }

  public static getText(type: string, values?: Record<string, string>): string {
    let intl = INTLS[0];
    let text = intl.formatMessage({id: `mail.${type}.text`}, values);
    let footer = intl.formatMessage({id: "mail.footer"});
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