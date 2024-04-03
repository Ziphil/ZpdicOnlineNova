//

import {faBook} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref} from "react";
import {AdditionalProps, GeneralIcon, aria} from "zographia";
import {Link} from "/client/component/atom/link";
import {createWithRef} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Dictionary} from "/client/skeleton";


export const DictionaryBadge = createWithRef(
  require("./dictionary-badge.scss"), "DictionaryBadgr",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary | {number: number},
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  } & AdditionalProps): ReactElement | null {

    const [innerDictionary] = useResponse("fetchDictionary", (!isFull(dictionary)) && {identifier: dictionary.number});
    const actualDictionary = (!isFull(dictionary)) ? innerDictionary : dictionary;

    return (actualDictionary !== undefined) ? (
      <Link styleName="root" href={`/dictionary/${actualDictionary.paramName || actualDictionary.number}`} variant="unstyledSimple" {...rest}>
        <span styleName="dummy" {...aria({hidden: true})}/>
        <GeneralIcon styleName="avatar" icon={faBook}/>
        {actualDictionary.name}
      </Link>
    ) : null;

  }
);


function isFull(dictionary: Dictionary | {number: number}): dictionary is Dictionary {
  return "id" in dictionary;
}