//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  Alert,
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
    file: null,
    alertOpen: false
  };

  private async deleteDictionary(): Promise<void> {
    let number = this.props.number;
    let response = await this.requestPost("deleteDictionary", {number});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionaryDeleted");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let alertText = `
      この辞書データを永久に削除します。
      削除した後にデータを戻すことはできません。
      本当によろしいですか?
    `;
    let node = (
      <Fragment>
        <form styleName="root">
          <Button label="削除" reactive={true} style="caution" onClick={() => this.setState({alertOpen: true})}/>
        </form>
        <p styleName="caution">
          この操作を行うと、辞書データが永久に削除されます。
          削除した後にデータを戻すことはできませんので、ボタンをクリックする前に入念に確認してください。
        </p>
        <Alert
          text={alertText}
          iconLabel="&#xF071;"
          confirmLabel="削除"
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.deleteDictionary.bind(this)}
        />
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
  file: File | null,
  alertOpen: boolean
};