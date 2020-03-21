//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./delete-dictionary-form.scss"))
export class DeleteDictionaryForm extends StoreComponent<Props, State> {

  public state: State = {
    file: null
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let response = await this.requestPost("deleteDictionary", {number});
    if (response.status === 200) {
      this.props.store!.sendInformation("dictionaryDeleted");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Fragment>
        <form styleName="root">
          <Button label="削除" reactive={true} onClick={this.click.bind(this)}/>
        </form>
        <p styleName="caution">
          この操作を行うと、辞書データが永久に削除されます。
          削除した後にデータを戻すことはできませんので、ボタンをクリックする前に入念に確認してください。
        </p>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  onSubmit?: () => void
};
type State = {
  file: File | null
};