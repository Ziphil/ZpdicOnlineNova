//

import {MouseEvent, SyntheticEvent} from "react";


export function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}

export function checkOpeningExternal(event: MouseEvent): boolean {
  return event.ctrlKey || event.metaKey;
}