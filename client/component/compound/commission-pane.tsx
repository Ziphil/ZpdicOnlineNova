//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode,
  lazy
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Commission
} from "/server/skeleton/commission";
import {
  Dictionary,
  EditWord
} from "/server/skeleton/dictionary";


@style(require("./commission-pane.scss"))
export default class CommissionPane extends Component<Props, State> {

  public state: State = {
    editorOpen: false
  };

  private async deleteCommission(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let id = this.props.commission.id;
    let response = await this.requestPost("deleteCommission", {number, id});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("commissionDeleted");
      if (this.props.onDeleteConfirm) {
        await this.props.onDeleteConfirm(event);
      }
    }
  }

  private async handleEditConfirm(word: EditWord, event: MouseEvent<HTMLButtonElement>): Promise<void> {
    await this.deleteCommission(event);
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
            <Button label={this.trans("commissionPane.delete")} iconLabel="&#xF2ED;" style="simple" onClick={(event) => this.deleteCommission(event)}/>
            <Button label={this.trans("commissionPane.add")} iconLabel="&#xF067;" style="simple" onClick={() => this.setState({editorOpen: true})}/>
          </div>
        </div>
        <WordEditor
          dictionary={this.props.dictionary}
          word={null}
          open={this.state.editorOpen}
          onClose={() => this.setState({editorOpen: false})}
          onEditConfirm={this.handleEditConfirm.bind(this)}
        />
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
  editorOpen: boolean
};