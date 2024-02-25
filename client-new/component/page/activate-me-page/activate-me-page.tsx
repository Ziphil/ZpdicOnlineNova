//

import {ReactElement} from "react";
import {useMount} from "react-use";
import {AdditionalProps} from "zographia";
import {create} from "/client-new/component/create";
import {LoadingPage} from "/client-new/component/page/loading-page";
import {useSearch} from "/client-new/hook/search";
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

    const activateUser = useActivateUser(tokenKey);

    useMount(async () => {
      await activateUser();
    });

    return (
      <LoadingPage/>
    );

  }
);
