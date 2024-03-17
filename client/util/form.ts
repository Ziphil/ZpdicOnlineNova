//

import {SyntheticEvent} from "react";


export function preventDefault(event: SyntheticEvent): void {
  event.preventDefault();
}