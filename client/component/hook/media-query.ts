//

import {
  useMediaQuery as useRawMediaQuery
} from "react-responsive";


export function useMediaQuery(): {smartphone: boolean, smallScreen: boolean} {
  const smartphone = useRawMediaQuery({maxWidth: "900px"});
  const smallScreen = useRawMediaQuery({maxWidth: "580px"});
  return {smartphone, smallScreen};
}