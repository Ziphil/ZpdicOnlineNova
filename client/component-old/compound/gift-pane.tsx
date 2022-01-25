//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./gift-pane.scss"))
export default class GiftPane extends Component<Props, State> {

  private jumpAmazon(): void {
    let url = "https://www.amazon.jp/hz/wishlist/ls/2WIWDYWRY374L?ref_=wl_share";
    window.open(url);
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="information">
          {this.trans("giftPane.information")}
        </div>
        <div styleName="button">
          <Button label={this.trans("giftPane.sendGift")} iconLabel="&#xF06B;" onClick={this.jumpAmazon}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  starCount: number | null
};