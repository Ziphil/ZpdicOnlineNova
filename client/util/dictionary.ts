//

import {Dictionary} from "/client/skeleton";


export function getDictionaryIdentifier(dictionary: Dictionary): string | number {
  return dictionary.paramName || dictionary.number;
}