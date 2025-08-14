//

import {ClientResponse} from "@sendgrid/client/src/response";
import {EmailData} from "@sendgrid/helpers/classes/email-address";
import sendgrid from "@sendgrid/mail";
import {INTLS} from "/server/language";


export function getMailSubject(type: string, values?: Record<string, string>): string {
  const intl = INTLS[0];
  const title = intl.formatMessage({id: `mail.${type}.subject`}, values);
  return title;
}

export function getMailText(type: string, values?: Record<string, string>): string {
  const intl = INTLS[0];
  const text = intl.formatMessage({id: `mail.${type}.text`}, values);
  const footer = intl.formatMessage({id: "mail.footer"});
  const wholeText = text + "\n" + footer;
  return wholeText;
}

export async function sendMail(to: EmailData, subject: string, text: string): Promise<ClientResponse> {
  const from = {name: "ZpDIC Online", email: "zpdic@ziphil.com"};
  const trackingSettings = {clickTracking: {enable: false, enableText: false}};
  const message = {to, from, subject, text, trackingSettings};
  const response = await sendgrid.send(message);
  return response[0];
}