//

import {SESv2Client, SendEmailCommand} from "@aws-sdk/client-sesv2";
import {INTLS} from "/server/language";
import {AWS_KEY, AWS_REGION, AWS_SECRET} from "/server/variable";


const client = new SESv2Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET
  }
});

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

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  const command = new SendEmailCommand({
    "FromEmailAddress": "ZpDIC Online <noreply@zpdic.ziphil.com>",
    "Destination": {"ToAddresses": [to]},
    "Content": {
      "Simple": {
        "Subject": {"Data": subject, "Charset": "UTF-8"},
        "Body": {"Text": {"Data": text, "Charset": "UTF-8"}}
      }
    }
  });
  await client.send(command);
}