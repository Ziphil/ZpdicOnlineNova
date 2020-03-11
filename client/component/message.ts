//


const MESSAGES = {
  emailChanged: "メールアドレスを変更しました。",
  passwordChanged: "パスワードを変更しました。",
  invalidName: "ユーザー名が不正です。ユーザー名は半角英数字とアンダーバーとハイフンのみで構成してください。",
  invalidEmail: "メールアドレスが不正です。",
  invalidPassword: "パスワードが不正です。パスワードは 6 文字以上 50 文字以下である必要があります。",
  duplicateName: "そのユーザー名はすでに存在しています。",
  loginFailed: "ログインに失敗しました。",
  invalidNumber: "この辞書は存在しません。",
  unauthenticated: "ログインしていません。ログインし直してください。",
  forbidden: "このコンテンツにアクセスする権限がありません。",
  messageNotFound: "エラーが発生しました。",
  serverNotFound: "実行すべき処理を行う API が見つかりませんでした。",
  unexpected: "予期しないエラーが発生しました。バグの可能性がありますので、お手数ですが管理者までご連絡ください。"
};

export function getMessage(type: string): string {
  let message;
  if (type in MESSAGES) {
    let anyMessages = MESSAGES as any;
    message = anyMessages[type];
  } else {
    message = MESSAGES["unexpected"];
  }
  return message;
}