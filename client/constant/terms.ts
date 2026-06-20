//

import dayjs from "dayjs";


export const TERMS_VERSION = 1;

/** 現行バージョンの利用規約・プライバシーポリシーの見なし同意期日 (適用開始日)。
 * この日時を過ぎてからでも 2 週間は適用後バナーを表示し、それ以降はバナーを表示しません。*/
export const TERMS_DEEMED_CONSENT_DATE = dayjs("2026-07-01T00:00:00+09:00");
