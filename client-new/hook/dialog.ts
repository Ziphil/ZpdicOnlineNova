//

import {useCallback, useState} from "react";


export function useDialogOpen<E, R>(config: DialogOpenConfig<E, R>): DialogOpenSpec<E, R> {
  const {handleSubmit, onOpen} = config;
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(function (): void {
    onOpen?.();
    setOpen(true);
  }, [onOpen]);
  const handleSubmitAndClose = useCallback(function (event: E): R {
    return handleSubmit(event, () => setOpen(false));
  }, [handleSubmit]);
  return {open, setOpen, openDialog, handleSubmitAndClose};
}

export type DialogOpenConfig<E, R> = {
  handleSubmit: (event: E, onSubmit: () => unknown) => R,
  onOpen?: () => void
};

export type DialogOpenSpec<E, R> = {
  open: boolean,
  setOpen: (open: boolean) => void,
  openDialog: () => void,
  handleSubmitAndClose: (event: E) => R
};