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


export const useRawUser = createGlobalState<DetailedUser | null>(null);

export function useDefaultUser(): {user: DetailedUser | null, ready: boolean} {
  const [user, setUser] = useRawUser();
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

export function useUser(): [DetailedUser | null, UserCallbacks] {
  const [user, setUser] = useRawUser();
  const fetchUser = useCallback(async function (): Promise<void> {
    const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    const response = await axios.post(url, {}, {validateStatus: () => true});
    if (response.status === 200) {
      const user = response.data;
      setUser(user);
    } else {
      setUser(null);
    }
  }, [setUser]);
  return [user, {fetchUser}];
}

type UserCallbacks = {
  fetchUser: () => Promise<void>
};