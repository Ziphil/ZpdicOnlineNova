//

import axios from "axios";
import {
  useCallback
} from "react";
import {
  atom,
  useRecoilState
} from "recoil";
import {
  DetailedUser
} from "/client/skeleton/user";
import {
  GtagUtil
} from "/client/util/gtag";
import {
  ResponseData,
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


export const meAtom = atom<DetailedUser | null>({key: "me", default: fetchMe()});

export function useMe(): [DetailedUser | null, UserCallbacks] {
  const [me, setMe] = useRecoilState(meAtom);
  const refetchMe = useCallback(async function (): Promise<void> {
    const me = await fetchMe();
    setMe(me);
  }, [setMe]);
  return [me, {refetchMe}];
}

async function fetchMe(): Promise<DetailedUser | null> {
  const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
  const response = await axios.post<ResponseData<"fetchUser">>(url, {}, {validateStatus: () => true});
  if (response.status === 200 && !("error" in response.data)) {
    const me = response.data;
    GtagUtil.set("user_properties", [["id", me.id], ["name", me.name], ["screen_name", me.screenName]]);
    return me;
  } else {
    return null;
  }
}

type UserCallbacks = {
  refetchMe: () => Promise<void>
};