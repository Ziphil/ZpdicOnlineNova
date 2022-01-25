//

import {
  useCallback
} from "react";
import {
  createGlobalState
} from "react-use";


let usePopupSpecs = createGlobalState<Array<PopupSpec>>([]);

export function usePopup(): [Array<PopupSpec>, PopupCallbacks] {
  let [popupSpecs, setPopupSpecs] = usePopupSpecs();
  let clearPopup = useCallback(function (id: number): void {
    setPopupSpecs((popupSpecs) => popupSpecs.filter((spec) => spec.id !== id));
  }, [setPopupSpecs]);
  let clearAllPopups = useCallback((): void => {
    setPopupSpecs([]);
  }, [setPopupSpecs]);
  let addPopup = useCallback(function (type: string, style: PopupStyle, timeout: number | null): number {
    let date = new Date();
    let id = date.getTime();
    setPopupSpecs((popupSpecs) => [...popupSpecs, {id, type, style}]);
    if (timeout !== null) {
      setTimeout(() => clearPopup(id), timeout);
    }
    return id;
  }, [setPopupSpecs, clearPopup]);
  let addErrorPopup = useCallback(function (type: string, timeout: number | null = 5000): number {
    let id = addPopup(type, "error", timeout);
    return id;
  }, [addPopup]);
  let addInformationPopup = useCallback(function (type: string, timeout: number | null = 5000): number {
    let id = addPopup(type, "information", timeout);
    return id;
  }, [addPopup]);
  return [popupSpecs, {addErrorPopup, addInformationPopup, clearPopup, clearAllPopups}];
}

type PopupStyle = "error" | "information";
type PopupSpec = {id: number, type: string, style: PopupStyle};

type PopupCallbacks = {
  addErrorPopup: (type: string, timeout?: number | null) => number,
  addInformationPopup: (type: string, timeout?: number | null) => number,
  clearPopup: (id: number) => void,
  clearAllPopups: () => void
};