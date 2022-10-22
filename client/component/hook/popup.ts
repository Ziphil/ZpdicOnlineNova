//

import {
  useCallback
} from "react";
import {
  atom,
  useRecoilValue,
  useSetRecoilState
} from "recoil";


const popupSpecsAtom = atom<Array<PopupSpec>>({key: "popupSpecs", default: []});

export function usePopupSpecs(): Array<PopupSpec> {
  const popupSpecs = useRecoilValue(popupSpecsAtom);
  return popupSpecs;
}

export function usePopup(): PopupCallbacks {
  const setPopupSpecs = useSetRecoilState(popupSpecsAtom);
  const clearPopup = useCallback(function (id: number): void {
    setPopupSpecs((popupSpecs) => popupSpecs.filter((spec) => spec.id !== id));
  }, [setPopupSpecs]);
  const clearAllPopups = useCallback((): void => {
    setPopupSpecs([]);
  }, [setPopupSpecs]);
  const addPopup = useCallback(function (type: string, scheme: PopupScheme, timeout: number | null): number {
    const date = new Date();
    const id = date.getTime();
    setPopupSpecs((popupSpecs) => [...popupSpecs, {id, type, scheme}]);
    if (timeout !== null) {
      setTimeout(() => clearPopup(id), timeout);
    }
    return id;
  }, [setPopupSpecs, clearPopup]);
  const addErrorPopup = useCallback(function (type: string, timeout: number | null = 5000): number {
    const id = addPopup(type, "red", timeout);
    return id;
  }, [addPopup]);
  const addInformationPopup = useCallback(function (type: string, timeout: number | null = 5000): number {
    const id = addPopup(type, "blue", timeout);
    return id;
  }, [addPopup]);
  return {addErrorPopup, addInformationPopup, clearPopup, clearAllPopups};
}

type PopupScheme = "red" | "blue";
type PopupSpec = {id: number, type: string, scheme: PopupScheme};

type PopupCallbacks = {
  addErrorPopup: (type: string, timeout?: number | null) => number,
  addInformationPopup: (type: string, timeout?: number | null) => number,
  clearPopup: (id: number) => void,
  clearAllPopups: () => void
};