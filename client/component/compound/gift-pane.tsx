//

import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";


const GiftPane = create(
  require("./gift-pane.scss"), "GiftPane",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("giftPane");

    const jumpAmazon = useCallback(function (): void {
      const url = "https://www.amazon.jp/hz/wishlist/ls/2WIWDYWRY374L?ref_=wl_share";
      window.open(url);
    }, []);

    const node = (
      <div styleName="root">
        <div styleName="information">
          {trans("information")}
        </div>
        <div styleName="button">
          <Button label={trans("sendGift")} iconName="gift" onClick={jumpAmazon}/>
        </div>
      </div>
    );
    return node;

  }
);


export default GiftPane;