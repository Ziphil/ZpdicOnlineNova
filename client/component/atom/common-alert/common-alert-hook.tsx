//

import {useCallback} from "react";
import {useAlert} from "zographia";
import {CommonAlert, CommonAlertConfig} from "./common-alert";


export function useCommonAlert(): (config: CommonAlertConfig) => void {
  const openAlert = useAlert();
  const openCommonAlert = useCallback(function (config: CommonAlertConfig): void {
    openAlert((close) => <CommonAlert config={config} close={close}/>);
  }, [openAlert]);
  return openCommonAlert;
}