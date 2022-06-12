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
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


export const useRawMe = createGlobalState<DetailedUser | null>(null);

export function useDefaultMe(): {user: DetailedUser | null, ready: boolean} {
  const [user, setUser] = useRawMe();
  const [ready, setReady] = useState(false);
  useMount(async () => {
    const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    const response = await axios.post(url, {}, {validateStatus: () => true});
    if (response.status === 200) {
      const user = response.data;
      setUser(user);
      setReady(true);
    } else {
      setUser(null);
      setReady(true);
    }
  });
  return {user, ready};
}

export function useMe(): [DetailedUser | null, UserCallbacks] {
  const [me, setMe] = useRawMe();
  const refetchMe = useCallback(async function (): Promise<void> {
    const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    const response = await axios.post(url, {}, {validateStatus: () => true});
    if (response.status === 200) {
      const me = response.data;
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