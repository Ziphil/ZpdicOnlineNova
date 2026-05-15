//

import {useCallback} from "react";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {invalidateAllResponses, useRequest} from "/client/hook/request";
import {setAnalyticsProperties} from "/client/util/gtag";
import {CommonResponse, RequestConfig, SERVER_PATH_PREFIX} from "/client/util/request";
import {UserWithDetail} from "/server/internal/skeleton";
import type {RequestData, ResponseData} from "/server/internal/type/rest";


export const meAtom = atom<UserWithDetail | null>({key: "me", default: fetchMe()});

export function useMe(): UserWithDetail | null {
  const me = useRecoilValue(meAtom);
  return me;
}

export function useRefetchMe(): () => Promise<void> {
  const setMe = useSetRecoilState(meAtom);
  const refetchMe = useCallback(async function (): Promise<void> {
    const me = await fetchMe();
    setMe(me);
  }, [setMe]);
  return refetchMe;
}

export function useLoginRequest(): (data: RequestData<"login">, config?: RequestConfig) => Promise<CommonResponse<"login">> {
  const request = useRequest();
  const setMe = useSetRecoilState(meAtom);
  const login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<CommonResponse<"login">> {
    const response = await request("login", data, config);
    if (response.status === 200) {
      const body = response.data;
      setMe(body.user);
    }
    return response;
  }, [request, setMe]);
  return login;
}

export function useLogoutRequest(): (config?: RequestConfig) => Promise<CommonResponse<"logout">> {
  const request = useRequest();
  const setMe = useSetRecoilState(meAtom);
  const logout = useCallback(async function (config?: RequestConfig): Promise<CommonResponse<"logout">> {
    const response = await request("logout", {}, config);
    if (response.status === 200) {
      setMe(null);
      await invalidateAllResponses();
    }
    return response;
  }, [request, setMe]);
  return logout;
}

async function fetchMe(): Promise<UserWithDetail | null> {
  const url = SERVER_PATH_PREFIX + "/fetchMe";
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  const response = await fetch(url, {method: "post", headers, body: "{}"});
  if (response.status === 200) {
    const data = await response.json() as ResponseData<"fetchMe">;
    const me = data;
    setAnalyticsProperties("user_properties", [["id", me.id], ["name", me.name], ["screen_name", me.screenName]]);
    return data;
  } else {
    return null;
  }
}
