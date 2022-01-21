//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component-function/atom/button";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";


const GiftPane = create(
  require("./gift-pane.scss"), "GiftPane",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let jumpAmazon = useCallback(function (): void {
      let url = "https://www.amazon.jp/hz/wishlist/ls/2WIWDYWRY374L?ref_=wl_share";
      window.open(url);
    }, []);

    let node = (
      <div styleName="root">
        <div styleName="information">
          {trans("giftPane.information")}
        </div>
        <div styleName="button">
          <Button label={trans("giftPane.sendGift")} iconLabel="&#xF06B;" onClick={jumpAmazon}/>
        </div>
      </div>
    );
    return node;

  }
);


export default GiftPane;