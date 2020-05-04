//

import {
  hasTypedOwnProperty
} from "/client/util/misc";


const MESSAGES = {
  emailChanged: "メールアドレスを変更しました。",
  passwordChanged: "パスワードを変更しました。",
  dictionaryNameChanged: "辞書の表示名を変更しました。",
  dictionaryParamNameChanged: "辞書の URL 用名称を変更しました。",
  dictionarySecretChanged: "辞書の一覧表示の設定を変更しました。",
  dictionaryExplanationChanged: "辞書の説明を変更しました。",
  dictionaryUploaded: "辞書のアップロードが完了しました。なお、データの反映には時間がかかる場合があります。",
  dictionaryDeleted: "辞書を削除しました。",
  wordEdited: "単語の編集が完了しました。",
  wordDeleted: "単語の削除が完了しました。",
  invalidUserName: "ユーザー名が不正です。半角英数字とアンダーバーとハイフンのみで構成され、数字以外の文字が 1 文字以上含まれている必要があります。",
  invalidEmail: "メールアドレスが不正です。",
  invalidPassword: "パスワードが不正です。6 文字以上 50 文字以下である必要があります。",
  duplicateUserName: "そのユーザー名はすでに存在しています。別のユーザー名を指定してください。",
  loginFailed: "ログインに失敗しました。",
  noSuchDictionaryNumber: "この番号の辞書は存在しません。",
  noSuchDictionaryParamName: "この名称の辞書は存在しません。",
  duplicateDictionaryParamName: "その URL 用名称はすでに利用されています。別の名称をしてしてください。",
  invalidDictionaryParamName: "URL 用名称が不正です。半角英数字とアンダーバーとハイフンのみで構成され、数字以外の文字が 1 文字以上含まれている必要があります。",
  noSuchWordNumber: "存在しない単語を編集しようとしました。",
  invalidArgument: "渡された引数が不正です。",
  unauthenticated: "ログインしていません。ログインし直してください。",
  forbidden: "このコンテンツにアクセスする権限がありません。",
  serverNotFound: "実行すべき処理を行う API が見つかりませんでした。",
  serverError: "サーバーでエラーが発生しました。時間を置いてもう一度お試しください。",
  serverTimeout: "サーバーが時間内に応答しませんでした。時間を置いてもう一度お試しください。",
  requestTimeout: "サーバーが時間内に応答しませんでした。時間を置いてもう一度お試しください。",
  messageNotFound: "ポップアップ用のメッセージが設定されていません。設定ミスの可能性がありますので、お手数ですが管理者までご連絡ください。",
  unexpected: "予期しないエラーが発生しました。バグの可能性がありますので、お手数ですが管理者までご連絡ください。"
};

export function getMessage(type: string): string {
  let nextType = (hasTypedOwnProperty(MESSAGES, type)) ? type : "messageNotFound";
  let message = MESSAGES[nextType];
  return message;
}