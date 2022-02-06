//

import {
  useMediaQuery as useRawMediaQuery
} from "react-responsive";


export function useMediaQuery(): {smartphone: boolean, smallScreen: boolean} {
  let smartphone = useRawMediaQuery({maxWidth: "900px"});
  let smallScreen = useRawMediaQuery({maxWidth: "580px"});
  return {smartphone, smallScreen};
}