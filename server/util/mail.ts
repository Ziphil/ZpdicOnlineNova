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
  trimIndent
} from "/client/util/misc";


const MAIL_TEXTS = {
  registerUser: trimIndent`
    ZpDIC Online へのご登録ありがとうございます。
    アカウントの作成が完了しましたのでご連絡いたします。
    ・ ユーザー ID: %name%
  `,
  issueUserResetToken: trimIndent`
    ZpDIC Online をご利用いただきありがとうございます。
    %br%
    以下の URL にアクセスし、パスワードリセットの手続きを進めてください。
    なお、この URL の有効期限は 1 時間です。
    有効期限が過ぎた場合は、この URL を用いてのパスワードリセットはできなくなりますので、改めて手続きを行ってください。
    ・ %url%
  `,
  footer: trimIndent`
    ────────────────────
    ZpDIC Online
    ・ http://zpdic.ziphil.com
  `
};


export class MailUtil {

  public static getText(type: keyof typeof MAIL_TEXTS, parameter: {[key: string]: string}): string {
    let text = MAIL_TEXTS[type];
    for (let [key, value] of Object.entries(parameter)) {
      text = text.replace("%" + key + "%", value);
    }
    text = text.replace("%br%", "");
    text += "\n\n" + MAIL_TEXTS.footer;
    return text;
  }

  public static async send(to: EmailData, subject: string, text: string): Promise<ClientResponse> {
    let from = {name: "ZpDIC Online", email: "zpdic@ziphil.com"};
    let trackingSettings = {clickTracking: {enable: false, enableText: false}};
    let message = {to, from, subject, text, trackingSettings};
    let response = await sendMailOriginal(message);
    return response[0];
  }

}