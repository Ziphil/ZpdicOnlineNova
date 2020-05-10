//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  PaginationButton
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  createStyleName
} from "/client/util/style-name";


@applyStyle(require("./pane-list.scss"))
export class PaneList<T> extends Component<Props<T>, State<T>> {

  public state: State<T> = {
    page: 0
  };

  public render(): ReactNode {
    let offset = this.props.size * this.state.page;
    let maxPage = Math.max(Math.ceil(this.props.items.length / this.props.size) - 1, 0);
    let displayedItems = this.props.items.slice(offset, offset + this.props.size);
    let panes = displayedItems.map(this.props.renderer);
    let paginationStyleName = createStyleName(
      "pagination",
      {if: displayedItems.length <= 0, true: "empty"}
    );
    let node = (
      <div styleName="root">
        <div styleName="pane">
          {panes}
        </div>
        <div styleName={paginationStyleName}>
          <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={(page) => this.setState({page})}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props<T> = {
  items: Array<T>,
  renderer: (item: T) => ReactNode,
  size: number
};
type State<T> = {
  page: number
};