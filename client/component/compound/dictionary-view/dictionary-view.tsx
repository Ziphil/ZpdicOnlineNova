//

import {faBook} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref} from "react";
import {AdditionalProps, GeneralIcon, aria} from "zographia";
import {Link} from "/client/component/atom/link";
import {createWithRef} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Dictionary} from "/client/skeleton";


export const DictionaryView = createWithRef(
  require("./dictionary-view.scss"), "DictionaryView",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary | number,
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  } & AdditionalProps): ReactElement | null {

    const [innerDictionary] = useResponse("fetchDictionary", (typeof dictionary === "number") && {identifier: dictionary});
    const actualDictionary = (typeof dictionary === "number") ? innerDictionary : dictionary;

    return (actualDictionary !== undefined) ? (
      <Link styleName="root" href={`/dictionary/${actualDictionary.paramName || actualDictionary.number}`} variant="unstyledSimple" {...rest}>
        <span styleName="dummy" {...aria({hidden: true})}/>
        <GeneralIcon styleName="avatar" icon={faBook}/>
        {actualDictionary.name}
      </Link>
    ) : null;

  }
);