//

import {useCallback} from "react";
import {useTrans} from "zographia";


export function useConfirmAlert(): () => boolean {
  const {trans} = useTrans();
  const showAlert = useCallback(function (): boolean {
    const confirmed = window.confirm(trans(":alert.message"));
    return confirmed;
  }, [trans]);
  return showAlert;
}
