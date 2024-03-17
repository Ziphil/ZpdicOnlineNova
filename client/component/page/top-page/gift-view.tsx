//

import {faGift} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


export const GiftView = create(
  require("./gift-view.scss"), "GiftView",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("topPage");

    return (
      <div styleName="root" {...rest}>
        <MultiLineText is="p">
          {trans("message.gift")}
        </MultiLineText>
        <div styleName="button">
          <Link href="https://www.amazon.jp/hz/wishlist/ls/2WIWDYWRY374L?ref_=wl_share" target="_blank" variant="solid">
            <LinkIconbag><GeneralIcon icon={faGift}/></LinkIconbag>
            {trans("subbutton.gift")}
          </Link>
        </div>
      </div>
    );

  }
);
