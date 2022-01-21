//

import axios from "axios";
import {
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


export let useRawUser = createGlobalState<DetailedUser | null>(null);

export function useDefaultUser(): {user: DetailedUser | null, ready: boolean} {
  let [user, setUser] = useRawUser();
  let [ready, setReady] = useState(true);
  useMount(async () => {
    let url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    let response = await axios.post(url, {}, {validateStatus: () => true});
    if (response.status === 200) {
      let user = response.data;
      setUser(user);
      setReady(true);
    } else {
      setUser(null);
      setReady(true);
    }
  });
  return {user, ready};
}

export function useUser(): DetailedUser | null {
  let [user] = useRawUser();
  return user;
}