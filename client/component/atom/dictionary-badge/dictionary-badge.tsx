//

import {faBook} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref} from "react";
import {AdditionalProps, GeneralIcon, aria} from "zographia";
import {Link} from "/client/component/atom/link";
import {createWithRef} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Dictionary} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";


export const DictionaryBadge = createWithRef(
  require("./dictionary-badge.scss"), "DictionaryBadgr",
  function ({
    dictionary,
    href,
    ...rest
  }: {
    dictionary: Dictionary | {number: number},
    href?: string,
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  } & AdditionalProps): ReactElement | null {

    const [innerDictionary] = useResponse("fetchDictionary", (!isFull(dictionary)) && {identifier: dictionary.number});
    const actualDictionary = (!isFull(dictionary)) ? innerDictionary : dictionary;

    const actualHref = href ?? ((actualDictionary !== undefined) ? `/dictionary/${getDictionaryIdentifier(actualDictionary)}` : "");

    return (actualDictionary !== undefined) ? (
      <Link styleName="root" href={actualHref} variant="unstyledSimple" {...rest}>
        <span styleName="dummy" {...aria({hidden: true})}/>
        <GeneralIcon styleName="avatar" icon={faBook}/>
        <span styleName="name">{actualDictionary.name}</span>
      </Link>
    ) : null;

  }
);


function isFull(dictionary: Dictionary | {number: number}): dictionary is Dictionary {
  return "id" in dictionary;
}