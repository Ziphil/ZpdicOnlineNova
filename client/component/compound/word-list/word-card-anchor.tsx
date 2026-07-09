//

import {AnchorHTMLAttributes, ReactElement, ReactNode} from "react";
import {Link} from "/client/component/atom/link";
import {WordPopover} from "/client/component/compound/word-popover";
import {create} from "/client/component/create";
import {checkWordHref} from "/client/util/dictionary";
import {useWordListDictionary} from "./word-list-context";


export const WordCardAnchor = create(
  null, "WordCardAnchor",
  function ({
    href,
    children,
    ...rest
  }: {
    href?: string,
    children?: ReactNode
  } & AnchorHTMLAttributes<HTMLAnchorElement>): ReactElement {

    const dictionary = useWordListDictionary();

    const wordNumber = (href !== undefined) ? checkWordHref(dictionary, href) : undefined;

    return (wordNumber !== undefined) ? (
      <WordPopover dictionary={dictionary} word={{number: wordNumber}} trigger={(
        <span>
          <Link href={href ?? ""} scheme="secondary" variant="underline" {...rest}>
            {children}
          </Link>
        </span>
      )}
      />
    ) : (
      <Link href={href ?? ""} scheme="secondary" variant="underline" {...rest}>
        {children}
      </Link>
    );

  }
);
