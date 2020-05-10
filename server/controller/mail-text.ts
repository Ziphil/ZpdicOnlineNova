//

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
  `
};
const FOOTER = trimIndent`
  ────────────────────
  ZpDIC Online
  ・ http://zpdic.ziphil.com
`;

export function getMailText(type: keyof typeof MAIL_TEXTS, parameter: {[key: string]: string}): string {
  let text = MAIL_TEXTS[type];
  for (let [key, value] of Object.entries(parameter)) {
    text = text.replace("%" + key + "%", value);
  }
  text = text.replace("%br%", "");
  text += "\n\n" + FOOTER;
  return text;
}