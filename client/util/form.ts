//

import {KeyboardEvent, MouseEvent, SyntheticEvent} from "react";


export function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}

export function checkOpeningExternal(event: MouseEvent | KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey;
}