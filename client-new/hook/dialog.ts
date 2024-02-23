//

import {useCallback, useState} from "react";


export function useDialogOpen<E, R>(handleSubmit: (event: E, onSubmit: () => unknown) => R): DialogOpenSpec<E, R> {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(function (): void {
    setOpen(true);
  }, []);
  const handleSubmitAndClose = useCallback(function (event: E): R {
    return handleSubmit(event, () => setOpen(false));
  }, [handleSubmit]);
  return {open, setOpen, openDialog, handleSubmitAndClose};
}

export type DialogOpenSpec<E, R> = {
  open: boolean,
  setOpen: (open: boolean) => void,
  openDialog: () => void,
  handleSubmitAndClose: (event: E) => R
};