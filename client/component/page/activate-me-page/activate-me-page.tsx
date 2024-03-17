//

import {ReactElement} from "react";
import {useMount} from "react-use";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";
import {LoadingPage} from "/client/component/page/loading-page";
import {useSearch} from "/client/hook/search";
import {useActivateUser} from "./activate-me-page-hook";


export const ActivateMePage = create(
  null, "ActivateMePage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const [search] = useSearch();
    const tokenKey = search.get("key") ?? "";

    const activateMe = useActivateUser(tokenKey);

    useMount(async () => {
      await activateMe();
    });

    return (
      <LoadingPage/>
    );

  }
);
