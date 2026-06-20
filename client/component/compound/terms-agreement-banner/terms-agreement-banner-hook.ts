//

import dayjs from "dayjs";
import {useCallback} from "react";
import {TERMS_DEEMED_CONSENT_DATE, TERMS_VERSION} from "/client/constant/terms";
import {useMe, useRefetchMe} from "/client/hook/auth";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {UserWithDetail} from "/server/internal/skeleton";


export type TermsAgreementBannerType = "before" | "after" | null;

export type TermsAgreementBannerSpec = {
  type: TermsAgreementBannerType,
  agree: () => Promise<void>
};

export function useTermsAgreementBanner(): TermsAgreementBannerSpec {
  const me = useMe();
  const request = useRequest();
  const refetchMe = useRefetchMe();
  const {dispatchSuccessToast} = useToast();
  const type = getBannerType(me);
  const agree = useCallback(async function (): Promise<void> {
    const response = await request("changeMyTermsAgreement", {termsVersion: TERMS_VERSION});
    await switchResponse(response, async () => {
      await refetchMe();
      dispatchSuccessToast("changeMyTermsAgreement");
    });
  }, [request, refetchMe, dispatchSuccessToast]);
  return {type, agree};
}

/** ログイン中ユーザーの同意状況と現在時刻から、表示すべきバナーの種別を判定します。
 * 同意バージョンが現行に満たない場合のみ、見なし同意期日を境に種別を切り替え、期日から 2 週間で表示を終了します。*/
function getBannerType(me: UserWithDetail | null): TermsAgreementBannerType {
  if (me !== null && me.termsAgreement.version < TERMS_VERSION) {
    const now = dayjs();
    const expireDate = TERMS_DEEMED_CONSENT_DATE.add(2, "week");
    if (now.isBefore(TERMS_DEEMED_CONSENT_DATE)) {
      return "before";
    } else if (now.isBefore(expireDate)) {
      return "after";
    } else {
      return null;
    }
  } else {
    return null;
  }
}
