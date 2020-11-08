//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode,
  Suspense,
  lazy
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Commission
} from "/client/skeleton/commission";
import {
  Dictionary,
  EditWord
} from "/client/skeleton/dictionary";


@style(require("./commission-pane.scss"))
export default class CommissionPane extends Component<Props, State> {

  public state: State = {
    alertOpen: false,
    editorOpen: false
  };

  private async deleteCommission(event: MouseEvent<HTMLButtonElement>, showPopup?: boolean): Promise<void> {
    let number = this.props.dictionary.number;
    let id = this.props.commission.id;
    let response = await this.request("deleteCommission", {number, id});
    if (response.status === 200) {
      if (showPopup) {
        this.props.store!.addInformationPopup("commissionDeleted");
      }
      if (this.props.onDeleteConfirm) {
        await this.props.onDeleteConfirm(event);
      }
    }
  }

  private async handleEditConfirm(word: EditWord, event: MouseEvent<HTMLButtonElement>): Promise<void> {
    await this.deleteCommission(event, false);
    if (this.props.onAddConfirm) {
      await this.props.onAddConfirm(word, event);
    }
  }

  public render(): ReactNode {
    let WordEditor = lazy(() => import("/client/component/compound/word-editor"));
    let node = (
      <Fragment>
        <div styleName="root">
          {this.props.commission.name}
          <div styleName="comment">
            {this.props.commission.comment}
          </div>
          <div styleName="button">
            <Button label={this.trans("commissionPane.delete")} iconLabel="&#xF2ED;" style="simple" onClick={() => this.setState({alertOpen: true})}/>
            <Button label={this.trans("commissionPane.add")} iconLabel="&#xF067;" style="simple" onClick={() => this.setState({editorOpen: true})}/>
          </div>
        </div>
        <Alert
          text={this.trans("commissionPane.alert")}
          confirmLabel={this.trans("commissionPane.delete")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.deleteCommission.bind(this)}
        />
        <Suspense fallback="">
          <WordEditor
            dictionary={this.props.dictionary}
            word={null}
            defaultEquivalentName={this.props.commission.name}
            open={this.state.editorOpen}
            onClose={() => this.setState({editorOpen: false})}
            onEditConfirm={this.handleEditConfirm.bind(this)}
          />
        </Suspense>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  commission: Commission,
  dictionary: Dictionary,
  onDeleteConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onAddConfirm?: (word: EditWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
  alertOpen: boolean,
  editorOpen: boolean
};