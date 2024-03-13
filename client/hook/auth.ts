//

import axios from "axios";
import {useCallback} from "react";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {invalidateAllResponses, useRequest} from "/client/hook/request";
import {DetailedUser} from "/client/skeleton";
import {setAnalyticsProperties} from "/client/util/gtag";
import {AxiosResponseSpec, RequestConfig} from "/client/util/request";
import {RequestData, ResponseData, SERVER_PATHS, SERVER_PATH_PREFIX} from "/server/type/internal";


export const meAtom = atom<DetailedUser | null>({key: "me", default: fetchMe()});

export function useMe(): DetailedUser | null {
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

export function useLoginRequest(): (data: RequestData<"login">, config?: RequestConfig) => Promise<AxiosResponseSpec<"login">> {
  const request = useRequest();
  const setMe = useSetRecoilState(meAtom);
  const login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    const response = await request("login", data, config);
    if (response.status === 200) {
      const body = response.data;
      setMe(body.user);
    }
    return response;
  }, [request, setMe]);
  return login;
}

export function useLogoutRequest(): (config?: RequestConfig) => Promise<AxiosResponseSpec<"logout">> {
  const request = useRequest();
  const setMe = useSetRecoilState(meAtom);
  const logout = useCallback(async function (config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    const response = await request("logout", {}, config);
    if (response.status === 200) {
      setMe(null);
      await invalidateAllResponses();
    }
    return response;
  }, [request, setMe]);
  return logout;
}

async function fetchMe(): Promise<DetailedUser | null> {
  const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
  const response = await axios.post<ResponseData<"fetchUser">>(url, {}, {validateStatus: () => true});
  if (response.status === 200 && !("error" in response.data)) {
    const me = response.data;
    setAnalyticsProperties("user_properties", [["id", me.id], ["name", me.name], ["screen_name", me.screenName]]);
    return me;
  } else {
    return null;
  }
}
