//

import {
  useCallback
} from "react";
import {
  createGlobalState
} from "react-use";


const usePopupSpecs = createGlobalState<Array<PopupSpec>>([]);

export function usePopup(): [Array<PopupSpec>, PopupCallbacks] {
  const [popupSpecs, setPopupSpecs] = usePopupSpecs();
  const clearPopup = useCallback(function (id: number): void {
    setPopupSpecs((popupSpecs) => popupSpecs.filter((spec) => spec.id !== id));
  }, [setPopupSpecs]);
  const clearAllPopups = useCallback((): void => {
    setPopupSpecs([]);
  }, [setPopupSpecs]);
  const addPopup = useCallback(function (type: string, style: PopupStyle, timeout: number | null): number {
    const date = new Date();
    const id = date.getTime();
    setPopupSpecs((popupSpecs) => [...popupSpecs, {id, type, style}]);
    if (timeout !== null) {
      setTimeout(() => clearPopup(id), timeout);
    }
    return id;
  }, [setPopupSpecs, clearPopup]);
  const addErrorPopup = useCallback(function (type: string, timeout: number | null = 5000): number {
    const id = addPopup(type, "error", timeout);
    return id;
  }, [addPopup]);
  const addInformationPopup = useCallback(function (type: string, timeout: number | null = 5000): number {
    const id = addPopup(type, "information", timeout);
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