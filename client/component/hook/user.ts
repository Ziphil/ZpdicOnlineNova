//

import axios from "axios";
import {
  useCallback,
  useState
} from "react";
import {
  createGlobalState,
  useMount
} from "react-use";
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


export const useRawMe = createGlobalState<DetailedUser | null>(null);

export function useDefaultMe(): {me: DetailedUser | null, ready: boolean} {
  const [me, setMe] = useRawMe();
  const [ready, setReady] = useState(false);
  useMount(async () => {
    const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    const response = await axios.post<ResponseData<"fetchUser">>(url, {}, {validateStatus: () => true});
    if (response.status === 200 && !("error" in response.data)) {
      const me = response.data;
      GtagUtil.set("user_properties", [["id", me.id], ["name", me.name], ["screen_name", me.screenName]]);
      setMe(me);
      setReady(true);
    } else {
      setMe(null);
      setReady(true);
    }
  });
  return {me, ready};
}

export function useMe(): [DetailedUser | null, UserCallbacks] {
  const [me, setMe] = useRawMe();
  const refetchMe = useCallback(async function (): Promise<void> {
    const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    const response = await axios.post<ResponseData<"fetchUser">>(url, {}, {validateStatus: () => true});
    if (response.status === 200 && !("error" in response.data)) {
      const me = response.data;
      GtagUtil.set("user_properties", [["id", me.id], ["name", me.name], ["screen_name", me.screenName]]);
      setMe(me);
    } else {
      setMe(null);
    }
  }, [setMe]);
  return [me, {refetchMe}];
}

export function useSuspenseMe(): [DetailedUser, UserCallbacks] {
  const [me, setMe] = useMe();
  if (me === null) {
    throw new Promise(() => {
      console.log("me suspended");
    });
  }
  return [me, setMe];
}

type UserCallbacks = {
  refetchMe: () => Promise<void>
};