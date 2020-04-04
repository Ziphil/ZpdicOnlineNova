//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  DictionaryPane,
  PaginationButton
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./dictionary-list.scss"))
export class DictionaryList extends Component<Props, State> {

  public state: State = {
    page: 0
  };

  public render(): ReactNode {
    let offset = this.props.size * this.state.page;
    let maxPage = Math.ceil(this.props.dictionaries.length / this.props.size) - 1;
    let displayedDictionaries = this.props.dictionaries.slice(offset, offset + this.props.size);
    let dictionaryPanes = displayedDictionaries.map((dictionary) => {
      return <DictionaryPane dictionary={dictionary} showsSetting={this.props.showsSetting} key={dictionary.id}/>;
    });
    let node = (
      <div styleName="root">
        <div styleName="dictionary">
          {dictionaryPanes}
        </div>
        <div styleName="pagination-button">
          <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={(page) => this.setState({page})}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionaries: Array<SlimeDictionarySkeleton>,
  showsSetting: boolean,
  size: number
};
type State = {
  page: number
};